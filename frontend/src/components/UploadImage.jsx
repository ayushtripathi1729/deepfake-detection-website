import React, { useState } from "react";

function UploadImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setImageURL("");
    setResult(null);
    setFeedbackSent(false);
    setErrorMessage("");
  };

  const handleURLChange = (e) => {
    setImageURL(e.target.value);
    setSelectedFile(null);
    setResult(null);
    setFeedbackSent(false);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setResult(null);
    setFeedbackSent(false);

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
        setErrorMessage("Please upload a file or enter an image URL.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        // Attempt to parse backend error message if present
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }
        setErrorMessage(
          errorData?.error || `Server responded with status ${response.status}`
        );
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Backend should return { label, score, heatmap, media_id }
      // Map to consistent keys for frontend use
      const mappedResult = {
        label: data.prediction
          ? Object.entries(data.prediction).reduce(
              (maxEntry, entry) => (entry[1] > maxEntry[1] ? entry : maxEntry),
              ["unknown", 0]
            )[0]
          : data.label || "unknown",
        score: data.prediction
          ? Math.max(...Object.values(data.prediction))
          : data.score || 0,
        heatmap: data.heatmap_url || data.heatmap || null,
        media_id: data.media_id || null,
        rawData: data,
      };

      setResult(mappedResult);
    } catch (error) {
      setErrorMessage("Failed to analyze image. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImageURL("");
    setResult(null);
    setFeedbackSent(false);
    setErrorMessage("");
  };

  const sendFeedback = async (correct) => {
    if (!result || !result.label) return;

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type: "image",
          media_id: result.media_id,
          feedback: correct ? "correct" : "incorrect",
        }),
      });
      setFeedbackSent(true);
    } catch {
      alert("Failed to send feedback.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg mx-auto p-8">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Upload Image for Analysis
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <div>
            <label htmlFor="file-upload" className="font-semibold block mb-2">
              Upload Image File
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="image-url" className="font-semibold block mb-2">
              Or enter image URL
            </label>
            <input
              id="image-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageURL}
              onChange={handleURLChange}
              className="border px-3 py-2 rounded w-full"
              aria-describedby="urlHelp"
            />
            <p id="urlHelp" className="text-xs text-gray-500 mt-1">
              Please enter a direct URL to an image file.
            </p>
          </div>

          {errorMessage && (
            <p className="text-red-600 font-semibold text-center">{errorMessage}</p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || (!selectedFile && !imageURL.trim())}
              className={`flex-grow bg-blue-600 text-white px-6 py-2 rounded font-semibold transition-opacity duration-200 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Analyzing..." : "Analyze Image"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-400 text-white px-6 py-2 rounded font-semibold transition-colors duration-200 hover:bg-gray-500"
            >
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8 text-center" role="region" aria-live="polite">
            {!result.error ? (
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
                  <span className="font-semibold">
                    {(result.score * 100).toFixed(2)}%
                  </span>
                </p>

                {result.heatmap && (
                  <figure className="flex flex-col items-center">
                    <figcaption className="text-gray-600 mb-2">
                      Heatmap Visualization
                    </figcaption>
                    <img
                      src={result.heatmap}
                      alt="Heatmap overlay visualization"
                      className="rounded shadow-lg border-2 border-gray-300"
                      style={{ width: "320px", height: "auto" }}
                    />
                  </figure>
                )}

                {!feedbackSent ? (
                  <section className="mt-6" aria-label="Feedback section">
                    <p className="font-semibold mb-2">Is the result correct?</p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => sendFeedback(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => sendFeedback(false)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
                      >
                        No
                      </button>
                    </div>
                  </section>
                ) : (
                  <p className="mt-4 font-semibold text-green-600">
                    Thank you for your feedback!
                  </p>
                )}
              </>
            ) : (
              <p className="text-red-600 font-semibold">{result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadImage;
