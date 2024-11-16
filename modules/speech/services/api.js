export const sendAudioToBackend = async (blob, sessionId) => {
  try {
    const formData = new FormData();
    const audioFile = new File([blob], "audio.webm", {
      type: "audio/webm",
      lastModified: Date.now(),
    });

    formData.append("audio", audioFile);
    formData.append("sessionId", sessionId);

    const response = await fetch("/api/speech/process", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending audio:", error);
    throw error;
  }
};
