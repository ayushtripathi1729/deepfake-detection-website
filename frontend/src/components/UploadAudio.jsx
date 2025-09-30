import React, { useState, useRef } from "react";

export default function UploadAudio() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [message, setMessage] = useState("");

  const inputFileRef = useRef(null);

  const handleFileChange = (e) => {
    setResult(null);
    setError("");
    setFeedback(null);
    setMessage("");
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setAudioUrl("");
    }
  };

  const handleLinkChange = (e) => {
    setResult(null);
    setError("");
    setFeedback(null);
    setMessage("");
    setAudioUrl(e.target.value);
    setAudioFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFeedback(null);
    setMessage("");
    setResult(null);

    if (!audioFile && !audioUrl.trim()) {
      setError("Please upload a file or enter a valid URL.");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (audioFile) {
        const formData = new FormData();
        formData.append("file", audioFile);

        response = await fetch("/api/check/audio", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("/api/check/audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: audioUrl.trim() }),
        });
      }

      if (!response.ok) {
        throw new Error("Server error during analysis");
      }

      const data = await response.json();
      setResult({ ...data, mediaId: generateMediaId() });
    } catch (err) {
      setError(err.message || "Failed to analyze audio");
    } finally {
      setLoading(false);
    }
  };

  // Simple ID generation for the media - replace with backend ID if available
  const generateMediaId = () => {
    return "audio-" + Date.now();
  };

  const handleReset = () => {
    setAudioFile(null);
    setAudioUrl("");
    setResult(null);
    setError("");
    setFeedback(null);
    setMessage("");
    if (inputFileRef.current) {
      inputFileRef.current.value = null;
    }
  };

  const submitFeedback = async (userFeedback) => {
    if (!result || !result.mediaId) {
      setMessage("No analysis result to provide feedback on.");
      return;
    }

    setMessage("Submitting feedback...");
    try {
      const response = await fetch("/api/feedback/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaId: result.mediaId,
          feedback: userFeedback,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      await response.json();
      setMessage("Feedback submitted successfully. Thank you!");
      setFeedback(userFeedback);
    } catch (err) {
      setMessage("Error submitting feedback. Please try again later.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">
        Upload Audio for Analysis
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="audioFile" className="block mb-2 font-medium text-gray-700">
            Upload Audio File
          </label>
          <input
            id="audioFile"
            ref={inputFileRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
                       file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100"
          />
          {audioFile && <p className="mt-1 text-gray-600">Selected: {audioFile.name}</p>}
        </div>

        <div>
          <label htmlFor="audioUrl" className="block mb-2 font-medium text-gray-700">
            Or enter audio URL
          </label>
          <input
            id="audioUrl"
            type="url"
            placeholder="https://example.com/audio.mp3"
            value={audioUrl}
            onChange={handleLinkChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Audio"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Reset
          </button>
        </div>
      </form>

      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

      {result && (
        <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-300">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Analysis Result:</h3>
          <p>
            <strong>Label:</strong> {result.label}
          </p>
          <p>
            <strong>Confidence Score:</strong> {(result.score * 100).toFixed(2)}%
          </p>
          {result.heatmap && (
            <>
              <p className="mt-4 font-semibold">Heatmap:</p>
              <img
                src={result.heatmap}
                alt="Detection heatmap"
                className="mt-2 max-w-full rounded-md border border-gray-400"
              />
            </>
          )}

          <div className="mt-6">
            <p className="font-semibold mb-2">Was this result helpful?</p>
            <div className="flex gap-4">
              <button
                type="button"
                disabled={feedback === "like"}
                onClick={() => submitFeedback("like")}
                className={`px-4 py-2 rounded-md text-white ${
                  feedback === "like" ? "bg-green-600 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                }`}
                aria-pressed={feedback === "like"}
              >
                👍 Yes
              </button>
              <button
                type="button"
                disabled={feedback === "dislike"}
                onClick={() => submitFeedback("dislike")}
                className={`px-4 py-2 rounded-md text-white ${
                  feedback === "dislike" ? "bg-red-600 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                }`}
                aria-pressed={feedback === "dislike"}
              >
                👎 No
              </button>
            </div>
            {message && <p className="mt-3 text-gray-700">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
