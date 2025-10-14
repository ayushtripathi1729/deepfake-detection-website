import os
import uuid
import requests
import torch
import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
from flask import Blueprint, request, jsonify
from torchvision import models, transforms
from PIL import Image

detect_audio_bp = Blueprint('detect_audio_bp', __name__)
CATEGORIES = ["deepfake", "manual_edit", "compression", "morphing", "original"]

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'wav', 'mp3', 'flac'}

def download_audio(url, folder):
    filename = f"{uuid.uuid4()}.wav"
    filepath = os.path.join(folder, filename)
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            with open(filepath, 'wb') as f: f.write(r.content)
            return filepath
    except: return None
    return None

def audio_to_spec(audio_path, sr=16000):
    y, _ = librosa.load(audio_path, sr=sr)
    S = librosa.feature.melspectrogram(y, sr=sr, n_mels=128, fmax=8000)
    S_dB = librosa.power_to_db(S, ref=np.max)
    fig, ax = plt.subplots()
    librosa.display.specshow(S_dB, sr=sr, fmax=8000, ax=ax)
    plt.axis('off')
    out_path = f"static/uploads/spec_{uuid.uuid4()}.png"
    fig.savefig(out_path, bbox_inches='tight', pad_inches=0)
    plt.close(fig)
    return out_path

def preprocess_spec(path):
    img = Image.open(path).convert("RGB")
    tf = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
    ])
    return tf(img).unsqueeze(0)

def load_model(path):
    model = models.resnet50(pretrained=False)
    model.fc = torch.nn.Linear(model.fc.in_features, len(CATEGORIES))
    model.load_state_dict(torch.load(path, map_location='cpu'), strict=False)
    model.eval()
    return model

def generate_piechart(probs, categories, save_path):
    plt.figure(figsize=(5,4))
    plt.pie(probs, labels=categories, autopct='%1.1f%%', startangle=90)
    plt.axis('equal')
    plt.savefig(save_path)
    plt.close()

@detect_audio_bp.route('/detect/audio', methods=['POST'])
def detect_audio():
    upload_folder = "static/uploads"
    result_folder = "static/results"
    os.makedirs(upload_folder, exist_ok=True)
    os.makedirs(result_folder, exist_ok=True)
    file = request.files.get('file')
    url = request.form.get('url')
    if file and allowed_file(file.filename):
        audio_path = os.path.join(upload_folder, f"{uuid.uuid4()}.wav")
        file.save(audio_path)
    elif url:
        audio_path = download_audio(url, upload_folder)
        if not audio_path:
            return jsonify({"error": "Failed to download audio."}), 400
    else:
        return jsonify({"error": "No audio file or URL provided."}), 400

    try:
        sr = 16000
        y, _ = librosa.load(audio_path, sr=sr)
        hop = sr # one second per segment
        segments = []
        predlist = []
        for idx, start in enumerate(range(0, len(y), hop)):
            end = min(len(y), start+hop)
            seg = y[start:end]
            tempwav = f"{upload_folder}/seg_{uuid.uuid4()}.wav"
            librosa.output.write_wav(tempwav, seg, sr)
            spec_img = audio_to_spec(tempwav, sr)
            x = preprocess_spec(spec_img)
            m1 = load_model("models/audio_model_1.pth")
            m2 = load_model("models/audio_model_2.pth")
            with torch.no_grad():
                p1 = torch.softmax(m1(x), 1)[0].cpu().numpy()
                p2 = torch.softmax(m2(x), 1)[0].cpu().numpy()
            pred = (p1 + p2) / 2
            predlist.append({"second": idx, "probabilities": {CATEGORIES[i]: float(pred[i]) for i in range(len(CATEGORIES))}})
            segments.append(pred)
            os.remove(tempwav)
            os.remove(spec_img)
        overall_probs = np.mean(segments, axis=0)
        piechart_path = os.path.join(result_folder, f"pie_{uuid.uuid4()}.png")
        generate_piechart(overall_probs, CATEGORIES, piechart_path)
        piechart_url = piechart_path.replace("static/", "/static/")
        suspicious_spans = []
        cs = None
        for i, p in enumerate(segments):
            if 1-p[CATEGORIES.index("original")] > 0.5:
                if cs is None: cs = {"start": i, "end": i}
                else: cs["end"] = i
            else:
                if cs: suspicious_spans.append(cs); cs = None
        if cs: suspicious_spans.append(cs)
        suspicious_spans = suspicious_spans[:3]
        return jsonify({
            "piechart_url": piechart_url,
            "suspicious_spans_seconds": suspicious_spans,
            "time_predictions": predlist
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
