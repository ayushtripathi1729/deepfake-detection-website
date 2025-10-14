import os
import uuid
import cv2
import torch
import requests
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
from flask import Blueprint, request, jsonify
from torchvision import models, transforms

detect_video_bp = Blueprint('detect_video_bp', __name__)

# Define categories for detection
CATEGORIES = ["deepfake", "manual_edit", "compression", "morphing", "original"]

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'mp4', 'avi', 'mov', 'mkv'}

def download_video_from_url(url, folder):
    filename = f"{uuid.uuid4()}.mp4"
    filepath = os.path.join(folder, filename)
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(r.content)
            return filepath
    except Exception:
        return None
    return None

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

def preprocess_frame(frame):
    pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    tensor = transform(pil_img).unsqueeze(0)
    return tensor

def load_model(model_path):
    model = models.resnet50(pretrained=False)
    model.fc = torch.nn.Linear(model.fc.in_features, len(CATEGORIES))
    model.load_state_dict(torch.load(model_path, map_location="cpu"), strict=False)
    model.eval()
    return model

def generate_piechart(probs, categories, save_path):
    plt.figure(figsize=(5,4))
    plt.pie(probs, labels=categories, autopct='%1.1f%%', startangle=90)
    plt.axis('equal')
    plt.savefig(save_path)
    plt.close()

@detect_video_bp.route('/detect/video', methods=['POST'])
def detect_video():
    upload_folder = "static/uploads"
    result_folder = "static/results"
    os.makedirs(upload_folder, exist_ok=True)
    os.makedirs(result_folder, exist_ok=True)

    file = request.files.get('file')
    url = request.form.get('url')

    if file and allowed_file(file.filename):
        video_path = os.path.join(upload_folder, f"{uuid.uuid4()}.mp4")
        file.save(video_path)
    elif url:
        video_path = download_video_from_url(url, upload_folder)
        if not video_path:
            return jsonify({"error": "Failed to download video."}), 400
    else:
        return jsonify({"error": "No video file or URL provided."}), 400

    try:
        # Load models (multi-model ensemble)
        model1_path = "models/model_1.pth"
        model2_path = "models/model_2.pth"
        model1 = load_model(model1_path)
        model2 = load_model(model2_path)

        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        frame_interval = max(1, int(fps // 2))  # Analyze 2 frames per second
        frame_idx = 0

        predictions_per_frame = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % frame_interval == 0:
                img_tensor = preprocess_frame(frame)
                with torch.no_grad():
                    probs1 = torch.softmax(model1(img_tensor), dim=1).cpu().numpy()
                    probs2 = torch.softmax(model2(img_tensor), dim=1).cpu().numpy()
                mean_probs = (probs1 + probs2) / 2
                predictions_per_frame.append((frame_idx, mean_probs))
            frame_idx += 1

        cap.release()

        # Aggregate predictions for pie chart
        agg_probs = np.mean([p[1] for p in predictions_per_frame], axis=0)
        piechart_path = os.path.join(result_folder, f"pie_{uuid.uuid4()}.png")
        generate_piechart(agg_probs, CATEGORIES, piechart_path)
        piechart_url = piechart_path.replace("static/", "/static/")

        # Calculate suspicious spans (when any class except original > 0.5)
        suspicious_spans = []
        current_span = None

        for idx, probs in predictions_per_frame:
            timestamp = idx / fps
            suspicious_score = 1 - probs[CATEGORIES.index("original")]
            if suspicious_score > 0.5:
                if current_span is None:
                    current_span = {'start': timestamp, 'end': timestamp}
                else:
                    current_span['end'] = timestamp
            else:
                if current_span is not None:
                    suspicious_spans.append(current_span)
                    current_span = None
        if current_span is not None:
            suspicious_spans.append(current_span)

        # Return top 3 suspicious spans if many
        suspicious_spans = suspicious_spans[:3]

        return jsonify({
            "piechart_url": piechart_url,
            "suspicious_spans_seconds": suspicious_spans,
            "frame_predictions": [
                {
                    "frame": f[0],
                    "timestamp_sec": f[0] / fps,
                    "probabilities": {CATEGORIES[i]: float(f[1][0][i]) for i in range(len(CATEGORIES))}
                }
                for f in predictions_per_frame[::max(1, len(predictions_per_frame)//20)]  # sampled for brevity
            ]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
