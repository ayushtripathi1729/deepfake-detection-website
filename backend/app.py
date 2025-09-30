from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from model import (
    detect_image,
    detect_video,
    detect_audio,
    detect_text,
    detect_file,
    add_user_feedback,
)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Serve heatmap images as static files
@app.route('/uploads/heatmaps/<filename>')
def serve_heatmap(filename):
    return send_from_directory('uploads/heatmaps', filename)

@app.route('/api/detect-image', methods=['POST'])
def api_detect_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    img_file = request.files['image']
    result = detect_image(img_file)
    return jsonify(result)

@app.route('/api/detect-video', methods=['POST'])
def api_detect_video():
    if 'video' in request.files:
        video_file = request.files['video']
        result = detect_video(video_file)
        return jsonify(result)
    else:
        data = request.get_json()
        url = data.get("url") if data else None
        if url:
            # Placeholder for handling video URL if supported
            result = detect_video(url)
            return jsonify(result)
        else:
            return jsonify({"error": "No video file or URL provided"}), 400

@app.route('/api/detect-audio', methods=['POST'])
def api_detect_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    audio_file = request.files['audio']
    result = detect_audio(audio_file)
    return jsonify(result)

@app.route('/api/detect-text', methods=['POST'])
def api_detect_text():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    text = data['text']
    result = detect_text(text)
    return jsonify(result)

@app.route('/api/detect-file', methods=['POST'])
def api_detect_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file_data = request.files['file']
    result = detect_file(file_data)
    return jsonify(result)

@app.route('/api/feedback', methods=['POST'])
def receive_feedback():
    data = request.get_json()
    media_type = data.get("media_type")
    media_id = data.get("media_id")
    feedback = data.get("feedback")
    add_user_feedback(media_type, media_id, feedback)
    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
