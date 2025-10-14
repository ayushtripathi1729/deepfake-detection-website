import os
import uuid
import numpy as np
import torch
import matplotlib.pyplot as plt
from flask import Blueprint, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification

detect_text_bp = Blueprint('detect_text_bp', __name__)
CATEGORIES = ["deepfake", "manual_edit", "compression", "morphing", "original"]

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'txt'}

def download_text_from_url(url, folder):
    filename = f"{uuid.uuid4()}.txt"
    filepath = os.path.join(folder, filename)
    try:
        import requests
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(r.text)
            return filepath
    except Exception:
        return None
    return None

def generate_piechart(probs, categories, save_path):
    plt.figure(figsize=(5,4))
    plt.pie(probs, labels=categories, autopct='%1.1f%%', startangle=90)
    plt.axis('equal')
    plt.savefig(save_path)
    plt.close()

def load_model_tokenizer(model_name, model_path):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_path)
    return tokenizer, model.eval()

def get_sentences(text):
    import re
    text = text.replace('\r\n', '\n')
    # Use period/newline as splitter
    return [s.strip() for s in re.split(r'[.!?\n]+', text) if s.strip()]

@detect_text_bp.route('/detect-text', methods=['POST'])
def detect_text():
    upload_folder = "static/uploads"
    result_folder = "static/results"
    os.makedirs(upload_folder, exist_ok=True)
    os.makedirs(result_folder, exist_ok=True)
    text_input = None
    file = request.files.get('file')
    url = request.form.get('url')
    if file and allowed_file(file.filename):
        content = file.read().decode('utf-8')
        text_input = content
    elif url:
        text_path = download_text_from_url(url, upload_folder)
        if not text_path:
            return jsonify({"error": "Failed to download text."}), 400
        with open(text_path, encoding='utf-8') as f:
            text_input = f.read()
    else:
        form_text = request.form.get('text')
        if form_text and form_text.strip():
            text_input = form_text.strip()
        else:
            return jsonify({"error": "No text/file/URL provided."}), 400

    try:
        sentences = get_sentences(text_input)
        if not sentences:
            return jsonify({"error": "No valid text found."}), 400

        # You can use any HuggingFace model you have fine-tuned for fake/manipulated text
        model1_name = 'distilbert-base-uncased'
        model1_path = 'models/text_model_1'
        tokenizer1, model1 = load_model_tokenizer(model1_name, model1_path)
        
        model2_name = 'distilroberta-base'
        model2_path = 'models/text_model_2'
        tokenizer2, model2 = load_model_tokenizer(model2_name, model2_path)

        predictions = []
        for sent in sentences:
            # Model 1
            inputs1 = tokenizer1(sent, return_tensors="pt", truncation=True)
            with torch.no_grad():
                logits1 = model1(**inputs1).logits
                prob1 = torch.softmax(logits1, dim=1).cpu().numpy()[0]
            # Model 2
            inputs2 = tokenizer2(sent, return_tensors="pt", truncation=True)
            with torch.no_grad():
                logits2 = model2(**inputs2).logits
                prob2 = torch.softmax(logits2, dim=1).cpu().numpy()[0]
            avg_prob = (prob1 + prob2) / 2
            predictions.append(avg_prob)

        # Overall
        overall_probs = np.mean(predictions, axis=0)
        piechart_path = os.path.join(result_folder, f"pie_{uuid.uuid4()}.png")
        generate_piechart(overall_probs, CATEGORIES, piechart_path)
        piechart_url = piechart_path.replace("static/", "/static/")

        # Per-sentence suspicious spans: any non-original prob > 0.5
        suspicious = []
        for idx, probs in enumerate(predictions):
            tampered_score = 1 - probs[CATEGORIES.index("original")]
            if tampered_score > 0.5:
                suspicious.append({"sentence_idx": idx, "text": sentences[idx], "probabilities": {CATEGORIES[i]: float(probs[i]) for i in range(len(CATEGORIES))}})

        suspicious = suspicious[:3]

        return jsonify({
            "piechart_url": piechart_url,
            "suspicious_sentences": suspicious,
            "sentence_predictions": [
                {"sentence_idx": i, "text": sentences[i], "probabilities": {CATEGORIES[j]: float(predictions[i][j]) for j in range(len(CATEGORIES))}}
                for i in range(len(sentences))
            ]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
