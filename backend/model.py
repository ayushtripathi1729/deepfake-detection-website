import os
import gdown
import torch
from torchvision import models
from PIL import Image
import numpy as np
import librosa
import torchvision.transforms as transforms
from PIL import Image

# Define categories
CATEGORIES = ["deepfake", "manual_edit", "compression", "morphing", "original"]

# Google Drive Model IDs for downloading pretrained weights
MODEL_IDS = {
    "image_model_1": "FILE_ID_1",
    "image_model_2": "FILE_ID_2",
    "video_model_1": "FILE_ID_3",
    "video_model_2": "FILE_ID_4",
    "audio_model_1": "FILE_ID_5",
    "audio_model_2": "FILE_ID_6",
    "text_model_1": "FILE_ID_7",
    "text_model_2": "FILE_ID_8"
}

MODEL_PATHS = {
    "image_model_1": "models/image_model_1.pth",
    "image_model_2": "models/image_model_2.pth",
    "video_model_1": "models/video_model_1.pth",
    "video_model_2": "models/video_model_2.pth",
    "audio_model_1": "models/audio_model_1.pth",
    "audio_model_2": "models/audio_model_2.pth",
    "text_model_1": "models/text_model_1",
    "text_model_2": "models/text_model_2",
}

def download_model(name):
    os.makedirs("models", exist_ok=True)
    path = MODEL_PATHS[name]
    if name.startswith("text_model"):
        # Text models are directories (HF transformers), handle differently if needed
        # Here, assumed downloaded/deployed differently
        return
    file_id = MODEL_IDS[name]
    if not os.path.exists(path):
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, path, quiet=False)

# Image/Video/AUDIO model architecture loader helper (ResNet50 based)
def build_resnet_model(num_classes=len(CATEGORIES)):
    model = models.resnet50(pretrained=False)
    model.fc = torch.nn.Linear(model.fc.in_features, num_classes)
    return model

def load_model(name):
    download_model(name)
    path = MODEL_PATHS[name]
    if name.startswith("text_model"):
        # Usually use HF transformers for text, import and load differently in text module
        raise NotImplementedError("Text model loading handled separately")
    model = build_resnet_model()
    model.load_state_dict(torch.load(path, map_location="cpu"), strict=False)
    model.eval()
    return model

# Image/audio/video preprocessing utils
def preprocess_image(path):
    img = Image.open(path).convert("RGB")
    transform = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
    ])
    return transform(img).unsqueeze(0)

def preprocess_audio_spectrogram(path, sr=16000):
    y, _ = librosa.load(path, sr=sr)
    S = librosa.feature.melspectrogram(y, sr=sr, n_mels=128, fmax=8000)
    S_dB = librosa.power_to_db(S, ref=np.max)
    img = Image.fromarray(np.uint8(plt.cm.jet((S_dB - S_dB.min())/(S_dB.max()-S_dB.min()))*255)).convert("RGB")
    transform = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
    ])
    return transform(img).unsqueeze(0)

# Ensemble prediction utilities per modality
def ensemble_predict_image(models, img_tensor):
    probs_sum = None
    for model in models:
        with torch.no_grad():
            p = torch.softmax(model(img_tensor), dim=1).cpu().numpy()
        probs_sum = p if probs_sum is None else probs_sum + p
    return (probs_sum / len(models))[0]

def ensemble_predict_audio(models, audio_tensor):
    # Similar to image, assuming preprocessed
    return ensemble_predict_image(models, audio_tensor)

def ensemble_predict_video(models, video_tensor):
    # Similar structure
    return ensemble_predict_image(models, video_tensor)

