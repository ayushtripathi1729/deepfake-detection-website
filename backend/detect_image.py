import os
import uuid
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
from flask import Blueprint, request, jsonify, current_app
import matplotlib.pyplot as plt
import requests
import cv2
import numpy as np

# Blueprint for registering routes in app.py
detect_image_bp = Blueprint('detect_image_bp', __name__)

# Detection classes/categories
CATEGORIES = ["deepfake", "manual_edit", "compression", "morphing", "original"]

# Util: check filetype
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'jpg', 'jpeg', 'png'}

# Util: download image from URL
def download_image_from_url(url, folder):
    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(folder, filename)
    response = requests.get(url, timeout=6)
    if response.status_code == 200:
        with open(filepath, 'wb') as f:
            f.write(response.content)
        return filepath
    return None

# Util: Preprocess image
def preprocess_image(path):
    img = Image.open(path).convert("RGB")
    transform = transforms.Compose([
        transforms.Resize((224, 224)),  # match input of model
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])
    return transform(img).unsqueeze(0)

# Util: GradCAM-like (last conv-block activations)
def generate_heatmap(model, img_tensor, original_path, save_folder):
    img_tensor.requires_grad_()
    model.eval()
    x = img_tensor
    activations = {}
    def hook_fn(module, inp, out):
        activations['value'] = out
    handle = model.layer4.register_forward_hook(hook_fn)
    output = model(x)
    pred_class = torch.argmax(output)
    loss = output[0, pred_class]
    model.zero_grad()
    loss.backward()
    pooled = torch.mean(activations['value'].detach(), dim=1).squeeze(0)
    pooled = np.maximum(pooled.cpu().numpy(), 0)
    pooled = pooled / np.max(pooled)
    img = cv2.imread(original_path)
    img = cv2.resize(img, (224, 224))
    heatmap = cv2.resize(pooled, (224, 224))
    heatmap = np.uint8(255 * heatmap)
    heatmap_img = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    overlay = cv2.addWeighted(img, 0.5, heatmap_img, 0.5, 0)
    out_path = os.path.join(save_folder, f"heatmap_{uuid.uuid4()}.jpg")
    cv2.imwrite(out_path, overlay)
    handle.remove()
    return out_path.replace("static/", "/static/")

# Util: Pie chart
def generate_piechart(probs, categories, save_folder):
    plt.figure(figsize=(5, 4))
    plt.pie(probs, labels=categories, autopct='%1.1f%%', startangle=90)
    plt.axis('equal')
    out_path = os.path.join(save_folder, f"pie_{uuid.uuid4()}.png")
    plt.savefig(out_path)
    plt.close()
    return out_path.replace("static/", "/static/")

# Util: load your pretrained multi-class model (edit as needed)
def load_model(model_path):
    model = models.resnet50(pretrained=False)
    model.fc = torch.nn.Linear(model.fc.in_features, len(CATEGORIES))
    model.load_state_dict(torch.load(model_path, map_location="cpu"), strict=False)
    model.eval()
    return model

@detect_image_bp.route('/detect/image', methods=['POST'])
def detect_image():
    upload_folder = "static/uploads"
    heatmap_folder = "static/heatmaps"
    result_folder = "static/results"
    model_path = "models/model_v3.pth"   # path to your model

    # Ensure folders exist
    os.makedirs(upload_folder, exist_ok=True)
    os.makedirs(heatmap_folder, exist_ok=True)
    os.makedirs(result_folder, exist_ok=True)

    file = request.files.get('file')
    url = request.form.get('url')

    if file and allowed_file(file.filename):
        filename = f"{uuid.uuid4()}.jpg"
        img_path = os.path.join(upload_folder, filename)
        file.save(img_path)
    elif url:
        img_path = download_image_from_url(url, upload_folder)
        if img_path is None:
            return jsonify({"error": "Failed to download image."}), 400
    else:
        return jsonify({"error": "No file or URL provided."}), 400

    try:
        # Preprocess
        img_tensor = preprocess_image(img_path)

        # Load models (you can load several and ensemble; this shows one)
        model1 = load_model(model_path)  # swap/add more for ensemble
        model2 = load_model(model_path)  # EXAMPLE: use different weights or models

        # Predict/probabilities (ensemble mean)
        probs1 = torch.softmax(model1(img_tensor), dim=1).detach().cpu().numpy()[0]
        probs2 = torch.softmax(model2(img_tensor), dim=1).detach().cpu().numpy()[0]
        mean_probs = (probs1 + probs2) / 2

        # Generate outputs
        heatmap_url = generate_heatmap(model1, img_tensor, img_path, heatmap_folder)
        piechart_url = generate_piechart(mean_probs, CATEGORIES, result_folder)
        result_dict = {CATEGORIES[i]: float(mean_probs[i]) for i in range(len(CATEGORIES))}

        return jsonify({
            "prediction": result_dict,
            "heatmap_url": heatmap_url,
            "piechart_url": piechart_url
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
