 Deepfake Detection Backend

This is the backend API server for the Deepfake Detection website project.  
It provides RESTful endpoints to accept various media types (image, video, text, audio, files) for deepfake/malware detection using AI models and heuristic algorithms.

## Features

- Flask-based API server with multiple endpoints:
  - `/api/check/image`
  - `/api/check/video`
  - `/api/check/text`
  - `/api/check/audio`
  - `/api/check/file`
- Accepts uploads via multipart form or URLs for remote files.
- Returns JSON responses with detection label, confidence score, and generated heatmap file paths.
- Includes stub AI models (can be replaced with custom trained models).
- Handles heatmap generation and image serving.
- Supports cross-origin requests (CORS enabled).
- Provides basic accuracy analysis utilities using scikit-learn.
- Designed to collect user feedback (can be extended with database).

## Project Structure

backend/
├── app.py # Main Flask web app with API routes
├── model.py # Stub detection models and utilities
├── requirements.txt # Python dependencies for API and modeling
├── uploads/ # Uploaded files and generated heatmaps stored here
├── static/ # Serves static heatmap images and frontend assets if needed
├── utils/ # Optional helper modules for processing
└── README.md # This file

text

## Requirements

- Python 3.8 or higher
- Listed packages in `requirements.txt`

Install packages using:

pip install -r requirements.txt

text

## Running the Server Locally

1. Ensure dependencies installed.
2. Run the backend server:

python app.py

text

3. The server runs by default on `http://localhost:5000`.
4. Frontend should be configured to send API requests to this address.

## API Usage

- Use multipart form data for file uploads.
- Use JSON payload for providing URLs or text data.
- Responses include:
  - `label`: classification label like `deepfake` or `real`.
  - `score`: confidence score (0.0 to 1.0).
  - `heatmap`: URL path to generated heatmap image (if applicable).

Example response:

{
"label": "deepfake",
"score": 0.87,
"heatmap": "/static/heatmaps/heatmap_abc123.png"
}

text

## Extending & Customizing

- Update or replace `model.py` with your trained models.
- Integrate additional preprocessing or postprocessing.
- Add database support for storing feedback or analysis results.
- Improve heatmap visualization or add audio/video specific visual explanation.

## License

MIT License

---

Feel free to contribute, report issues, or request features.
