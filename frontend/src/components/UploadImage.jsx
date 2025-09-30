import React, { useState } from "react";

function UploadImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setImageURL("");
    setResult(null);
    setFeedbackSent(false);
  };

  const handleURLChange = (e) => {
    setImageURL(e.target.value);
    setSelectedFile(null);
    setResult(null);
    setFeedbackSent(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        response = await fetch("/api/detect-image", {
          method: "POST",
          body: formData,
        });
      } else if (imageURL.trim() !== "") {
        response = await fetch("/api/detect-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: imageURL.trim() }),
        });
      } else {
        setResult({ error: "Please upload a file or enter an image URL." });
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to analyze image." });
    }

    setLoading(false);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImageURL("");
    setResult(null);
    setFeedbackSent(false);
  };

  const sendFeedback = async (correct) => {
    if (!result || !result.label) return;

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type: "image",
          media_id: result.media_id || null,
          feedback: correct ? "correct" : "incorrect",
        }),
      });
      setFeedbackSent(true);
    } catch {
      alert("Failed to send feedback.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg mx-auto p-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Upload Image for Analysis</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="font-semibold block mb-2">Upload Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="font-semibold block mb-2">Or enter image URL</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageURL}
              onChange={handleURLChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || (!selectedFile && !imageURL)}
              className={`flex-grow bg-blue-600 text-white px-6 py-2 rounded font-semibold ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Analyzing..." : "Analyze Image"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-400 text-white px-6 py-2 rounded font-semibold"
            >
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8 text-center">
            {result.error ? (
              <p className="text-red-600 font-semibold">{result.error}</p>
            ) : (
              <>
                <p
                  className={`text-xl font-bold mb-2 ${
                    result.label === "deepfake" ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {result.label.charAt(0).toUpperCase() + result.label.slice(1)}
                </p>
                <p className="text-gray-800 mb-4">
                  Confidence:{" "}
                  <span className="font-semibold">{(result.score * 100).toFixed(2)}%</span>
                </p>
                {result.heatmap && (
                  <div className="flex flex-col items-center">
                    <span className="text-gray-600 mb-2">Heatmap Visualization:</span>
                    <img
                      src={result.heatmap}
                      alt="Heatmap"
                      className="rounded shadow-lg"
                      style={{ width: "320px", height: "auto", border: "2px solid #ccc" }}
                    />
                  </div>
                )}
                {!feedbackSent ? (
                  <div className="mt-6">
                    <p className="font-semibold mb-2">Is the result correct?</p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => sendFeedback(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => sendFeedback(false)}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        No
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 font-semibold text-green-600">
                    Thank you for your feedback!
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadImage;
