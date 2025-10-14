import os, uuid, requests, gdown
from flask import Blueprint, request, jsonify
from PIL import Image
import torch
import torchvision.transforms as transforms
from torchvision import models
import matplotlib.pyplot as plt
import cv2
import numpy as np

detect_image_bp = Blueprint('detect_image_bp', __name__)

# ---------- Settings (change these for your deployment!) ----------
CATEGORIES = ["deepfake", "manual_edit", "compression", "morphing", "original"]
MODEL_IDS = [
    "YOUR_GOOGLE_DRIVE_FILE_ID_1",  # Replace with actual file id
    "YOUR_GOOGLE_DRIVE_FILE_ID_2"   # Add more for ensemble, or duplicate for single model
]

MODEL_FILES = [
    "models/model_1.pth",
    "models/model_2.pth"
]
# -----------------------------------------------------------------

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'jpg', 'jpeg', 'png'}

def download_image_from_url(url, folder):
    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(folder, filename)
    try:
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            with open(filepath, 'wb') as f: f.write(r.content)
            return filepath
    except: return None
    return None

def preprocess_image(path):
    img = Image.open(path).convert('RGB')
    transform = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
    ])
    return transform(img).unsqueeze(0)

def ensure_models():
    os.makedirs("models", exist_ok=True)
    for file_id, file_path in zip(MODEL_IDS, MODEL_FILES):
        if not os.path.exists(file_path):
            url = f"https://drive.google.com/uc?id={file_id}"
            gdown.download(url, file_path, quiet=False)

def load_model(path):
    model = models.resnet50(pretrained=False)
    model.fc = torch.nn.Linear(model.fc.in_features, len(CATEGORIES))
    model.load_state_dict(torch.load(path, map_location='cpu'), strict=False)
    model.eval()
    return model

def generate_heatmap(model, x, original_path, save_folder):
    x.requires_grad_()
    activations = {}
    def hook_fn(module, inp, out): activations['value'] = out
    h = model.layer4.register_forward_hook(hook_fn)
    out = model(x)
    pred_class = torch.argmax(out)
    loss = out[0, pred_class]; model.zero_grad(); loss.backward()
    pooled = torch.mean(activations['value'].detach(), 1).squeeze(0)
    pooled = np.maximum(pooled.cpu().numpy(), 0); pooled /= (np.max(pooled)+1e-8)
    img = cv2.imread(original_path)
    img = cv2.resize(img, (224,224)); heatmap = cv2.resize(pooled, (224,224))
    heatmap = np.uint8(255*heatmap)
    heatmap_img = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    overlay = cv2.addWeighted(img, 0.5, heatmap_img, 0.5, 0)
    os.makedirs(save_folder, exist_ok=True)
    out_path = os.path.join(save_folder, f"heatmap_{uuid.uuid4()}.jpg")
    cv2.imwrite(out_path, overlay); h.remove()
    return out_path.replace("static/", "/static/")

def generate_piechart(probs, categories, save_folder):
    plt.figure(figsize=(5,4))
    plt.pie(probs, labels=categories, autopct='%1.1f%%', startangle=90)
    plt.axis('equal')
    os.makedirs(save_folder, exist_ok=True)
    out_path = os.path.join(save_folder, f"pie_{uuid.uuid4()}.png")
    plt.savefig(out_path); plt.close()
    return out_path.replace("static/", "/static/")

@detect_image_bp.route('/detect-image', methods=['POST'])
def detect_image():
    upload_folder, heatmap_folder, result_folder = \
        "static/uploads", "static/heatmaps", "static/results"
    os.makedirs(upload_folder, exist_ok=True)
    file = request.files.get('file'); url = request.form.get('url')
    if file and allowed_file(file.filename):
        fname = f"{uuid.uuid4()}.jpg"; img_path = os.path.join(upload_folder, fname); file.save(img_path)
    elif url: img_path = download_image_from_url(url, upload_folder)
    else: return jsonify({"error": "No file or URL provided."}), 400
    if not img_path: return jsonify({"error": "Invalid file/URL."}), 400

    try:
        ensure_models()
        img_tensor = preprocess_image(img_path)
        # Ensemble prediction
        ensemble_probs = np.zeros(len(CATEGORIES))
        for model_file in MODEL_FILES:
            model = load_model(model_file)
            with torch.no_grad():
                prob = torch.softmax(model(img_tensor),1)[0].cpu().numpy()
                ensemble_probs += prob
        mean_probs = ensemble_probs / len(MODEL_FILES)
        # Visualizations
        heatmap_url = generate_heatmap(load_model(MODEL_FILES[0]), img_tensor, img_path, heatmap_folder)
        piechart_url = generate_piechart(mean_probs, CATEGORIES, result_folder)
        result = {CATEGORIES[i]: float(mean_probs[i]) for i in range(len(CATEGORIES))}
        return jsonify({"prediction": result, "heatmap_url": heatmap_url, "piechart_url": piechart_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
