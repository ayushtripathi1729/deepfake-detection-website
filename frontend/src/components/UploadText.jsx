import React, { useState } from "react";

export default function UploadText() {
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFeedback(null);
    setMessage("");
    setResult(null);

    if (!textInput.trim()) {
      setError("Please enter text to analyze.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/check/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      });

      if (!response.ok) {
        throw new Error("Server error during text analysis.");
      }

      const data = await response.json();
      setResult({ ...data, mediaId: generateMediaId() });
    } catch (err) {
      setError(err.message || "Failed to analyze text.");
    } finally {
      setLoading(false);
    }
  };

  const generateMediaId = () => "text-" + Date.now();

  const handleReset = () => {
    setTextInput("");
    setResult(null);
    setError("");
    setFeedback(null);
    setMessage("");
  };

  const submitFeedback = async (userFeedback) => {
    if (!result || !result.mediaId) {
      setMessage("No analysis result to provide feedback on.");
      return;
    }

    setMessage("Submitting feedback...");
    try {
      const response = await fetch("/api/feedback/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaId: result.mediaId,
          feedback: userFeedback,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback.");
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
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Analyze Text</h2>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <textarea
          className="w-full h-48 border rounded-md p-4 text-gray-800 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Paste suspicious text here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          spellCheck="false"
          required
          aria-label="Input text to analyze"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Text"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </div>
      </form>

      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

      {result && (
        <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-300" role="region" aria-live="polite">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Result:</h3>
          <p><strong>Label:</strong> {result.label}</p>
          <p><strong>Confidence:</strong> {(result.score * 100).toFixed(2)}%</p>

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
