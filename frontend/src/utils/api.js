const BASE_URL = "http://localhost:5000/api/check";

async function checkMedia(type, file = null, url = "") {
  const endpoint = `${BASE_URL}/${type}`;

  try {
    let response;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
    } else if (url) {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    } else {
      throw new Error("Either file or URL must be provided.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || "Failed to fetch from server.";
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function checkImage(file, url) {
  return checkMedia("image", file, url);
}

export async function checkVideo(file, url) {
  return checkMedia("video", file, url);
}

export async function checkAudio(file, url) {
  return checkMedia("audio", file, url);
}

export async function checkText(text) {
  try {
    const response = await fetch(`${BASE_URL}/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || "Failed to fetch from server.";
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function checkFile(file, url) {
  return checkMedia("file", file, url);
}

export async function submitFeedback(mediaType, mediaId, feedbackData) {
  try {
    const response = await fetch(`http://localhost:5000/api/feedback/${mediaType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaId, feedback: feedbackData }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || "Failed to submit feedback.";
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}
