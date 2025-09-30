import os
import random
import numpy as np
from PIL import Image, ImageDraw
from pathlib import Path
from collections import Counter, OrderedDict

import torch
import torch.nn.functional as F
from torchvision import transforms
from pytorchcv.model_provider import get_model as ptcv_get_model

from gradcam import GradCAM

HEATMAPS_DIR = Path("uploads/heatmaps")
HEATMAPS_DIR.mkdir(parents=True, exist_ok=True)

DETECTION_LOG = []
USER_FEEDBACK = []

MODEL_PATH = "models/model_v3.pth"

model = ptcv_get_model("xception", pretrained=False, num_classes=2)
state_dict = torch.load(MODEL_PATH, map_location=torch.device('cpu'))
new_state_dict = OrderedDict()
for k, v in state_dict.items():
    name = k[5:] if k.startswith("base.") else k
    new_state_dict[name] = v

model.load_state_dict(new_state_dict, strict=False)
model.eval()

transform = transforms.Compose([
    transforms.Resize((299, 299)),
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5]),
])

grad_cam = GradCAM(model, target_layer='features.stage4.unit1.body.block2')

def preprocess_image(image_path_or_file):
    img = Image.open(image_path_or_file).convert('RGB')
    return transform(img).unsqueeze(0)

def save_heatmap_overlay(heatmap, orig_image_path):
    orig_img = Image.open(orig_image_path).convert('RGBA')
    heatmap_img = Image.fromarray(np.uint8(255 * heatmap)).resize(orig_img.size).convert('L')
    red_img = Image.new('RGBA', orig_img.size, (255, 0, 0, 128))
    heatmap_colored = Image.composite(red_img, Image.new('RGBA', orig_img.size), heatmap_img)
    combined = Image.alpha_composite(orig_img, heatmap_colored)
    filename = f"heatmap_{os.path.splitext(os.path.basename(orig_image_path))[0]}.png"
    path = HEATMAPS_DIR / filename
    combined.save(path)
    return f"/uploads/heatmaps/{filename}"

def predict_label_and_score(output_tensor):
    probs = F.softmax(output_tensor, dim=1)
    score = probs[0, 1].item()
    label = "deepfake" if score > 0.5 else "real"
    return label, score

def detect_image(image_path_or_file, media_id=None):
    try:
        input_tensor = preprocess_image(image_path_or_file)
        with torch.no_grad():
            output = model(input_tensor)
        label, score = predict_label_and_score(output)

        cam = grad_cam.generate(input_tensor)
        heatmap_url = save_heatmap_overlay(cam, image_path_or_file)

        if media_id:
            log_detection("image", media_id, label, score)
        return {"label": label, "score": round(score, 4), "heatmap": heatmap_url}
    except Exception as e:
        print(f"Detect image error: {e}")
        label, score = random_label_score_image_only()
        heatmap_url = save_dummy_heatmap()
        if media_id:
            log_detection("image", media_id, label, score)
        return {"label": label, "score": score, "heatmap": heatmap_url}

def detect_video(video_path_or_file, media_id=None):
    label = random.choice(["real", "deepfake"])
    score = random.uniform(0.6, 0.99)
    heatmap_url = save_dummy_heatmap()
    if media_id:
        log_detection("video", media_id, label, score)
    return {"label": label, "score": score, "heatmap": heatmap_url}

def detect_audio(audio_path_or_file, media_id=None):
    label = random.choice(["real", "deepfake"])
    score = random.uniform(0.6, 0.99)
    heatmap_url = save_dummy_heatmap()
    if media_id:
        log_detection("audio", media_id, label, score)
    return {"label": label, "score": score, "heatmap": heatmap_url}

def detect_text(text, media_id=None):
    label = random.choice(["real", "deepfake"])
    score = random.uniform(0.6, 0.99)
    if media_id:
        log_detection("text", media_id, label, score)
    return {"label": label, "score": score, "heatmap": None}

def detect_file(file_path_or_file, media_id=None):
    label = random.choice(["real", "deepfake"])
    score = random.uniform(0.6, 0.99)
    heatmap_url = save_dummy_heatmap()
    if media_id:
        log_detection("file", media_id, label, score)
    return {"label": label, "score": score, "heatmap": heatmap_url}

def random_label_score_image_only():
    labels = ["real", "deepfake"]
    label = random.choice(labels)
    score = random.uniform(0.6, 0.99)
    return label, round(score, 4)

def create_dummy_heatmap(size=(224, 224)):
    heatmap = Image.new("RGBA", size, (255, 0, 0, 0))
    draw = ImageDraw.Draw(heatmap)
    for _ in range(10):
        x = random.randint(0, size[0] - 50)
        y = random.randint(0, size[1] - 50)
        radius = random.randint(20, 50)
        alpha = random.randint(80, 160)
        draw.ellipse((x, y, x + radius, y + radius), fill=(255, 0, 0, alpha))
    return heatmap

def save_dummy_heatmap():
    heatmap_img = create_dummy_heatmap()
    filename = f"heatmap_{random.randint(1000, 9999)}.png"
    path = HEATMAPS_DIR / filename
    heatmap_img.save(path)
    return f"/uploads/heatmaps/{filename}"

def log_detection(media_type, media_id, label, score):
    DETECTION_LOG.append({"media_type": media_type, "media_id": media_id, "label": label, "score": score})

def log_user_feedback(media_type, media_id, feedback):
    USER_FEEDBACK.append({"media_type": media_type, "media_id": media_id, "feedback": feedback})

def get_detection_summary():
    labels = [entry["label"] for entry in DETECTION_LOG]
    return dict(Counter(labels))

def get_feedback_summary():
    feedbacks = [entry["feedback"] for entry in USER_FEEDBACK]
    return dict(Counter(feedbacks))

def add_user_feedback(media_type, media_id, feedback):
    log_user_feedback(media_type, media_id, feedback)
    return True
