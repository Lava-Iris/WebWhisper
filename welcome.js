document.getElementById("requestMic").addEventListener("click", async () => {
  const statusEl = document.getElementById("status");

  try {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    statusEl.textContent = "Microphone access granted!";
    console.log("Microphone access granted.");

    // Stop the microphone stream (optional if you don't need it immediately)
    stream.getTracks().forEach(track => track.stop());
  } catch (err) {
    if (err.name === "NotAllowedError") {
      statusEl.textContent = "Microphone access was denied. Please enable it in your browser settings.";
    } else if (err.name === "NotFoundError") {
      statusEl.textContent = "No microphone found. Please connect a microphone.";
    } else {
      statusEl.textContent = `Error requesting microphone access: ${err.message}`;
    }
    console.error("Error requesting microphone access:", err);
  }
});
  