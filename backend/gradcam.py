import torch
import numpy as np
import cv2
import os
import uuid
from torchvision import models
from PIL import Image

class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        self.hook_layers()

    def hook_layers(self):
        def backward_hook(module, grad_in, grad_out):
            self.gradients = grad_out[0].detach()

        def forward_hook(module, inp, out):
            self.activations = out.detach()

        self.target_layer.register_forward_hook(forward_hook)
        self.target_layer.register_backward_hook(backward_hook)

    def generate_heatmap(self, input_tensor, target_class=None):
        self.model.eval()
        output = self.model(input_tensor)
        if target_class is None:
            target_class = output.argmax(dim=1).item()

        self.model.zero_grad()
        loss = output[0][target_class]
        loss.backward()

        gradients = self.gradients[0].cpu().numpy()
        activations = self.activations[0].cpu().numpy()
        weights = np.mean(gradients, axis=(1, 2))
        cam = np.zeros(activations.shape[1:], dtype=np.float32)

        for i, w in enumerate(weights):
            cam += w * activations[i]

        cam = np.maximum(cam, 0)
        cam = cv2.resize(cam, (input_tensor.shape[2], input_tensor.shape[3]))
        cam = cam - np.min(cam)
        cam = cam / (np.max(cam) + 1e-8)
        return cam

def save_heatmap_on_image(img_path, heatmap, output_folder):
    os.makedirs(output_folder, exist_ok=True)
    img = cv2.imread(img_path)
    img = cv2.resize(img, (heatmap.shape[1], heatmap.shape[0]))
    heatmap_img = cv2.applyColorMap(np.uint8(255 * heatmap), cv2.COLORMAP_JET)
    overlayed_img = heatmap_img * 0.4 + img * 0.6
    filename = f"gradcam_{uuid.uuid4()}.jpg"
    out_path = os.path.join(output_folder, filename)
    cv2.imwrite(out_path, overlayed_img)
    return out_path.replace("static/", "/static/")

def create_heatmap(model, input_tensor, img_path, output_folder, target_layer=None):
    if target_layer is None:
        # Default to last conv layer of ResNet
        target_layer = model.layer4

    gradcam = GradCAM(model, target_layer)
    heatmap = gradcam.generate_heatmap(input_tensor)
    heatmap_path = save_heatmap_on_image(img_path, heatmap, output_folder)
    return heatmap_path
