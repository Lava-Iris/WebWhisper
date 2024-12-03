let isRecording = false;
const button = document.getElementById("toggleButton");

chrome.storage.local.get(["isRecording"], (result) => {
  isRecording = result.isRecording || false;
  updateButtonState();
});
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Speech Recognition is not supported in this browser.");
}

let recognition;
let commandRecognition;
let isListening = false;
let timeout;
const transcriptionEl = document.getElementById("transcription");

function startRecording() {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US"; // Set language to English
  recognition.interimResults = true; // Show results while speaking
  recognition.maxAlternatives = 1; // Limit alternatives for simplicity
  recognition.continuous = true; // Continue recognition until stopped

  // Handle interim and final results
  recognition.onresult = function (event) {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    transcriptionEl.textContent = transcript;
    resetTimeout(); // Reset the timeout whenever we get results
  };

  recognition.onend = function () {
    isListening = false;
    transcriptionEl.textContent = "Speech recognition stopped.";
    console.log(transcriptionEl.textContent);
  };

  recognition.onerror = function (event) {
    transcriptionEl.textContent = "Error: " + event.error;
    console.error("Error: " + event.error);
  };

  recognition.start();
}

function resetTimeout() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (isRecording) {
      transcriptionEl.textContent += "\n\n Sent";
      console.log(transcriptionEl.textContent);
    }
  }, 3000);
}

function stopRecording() {
  if (recognition) {
    recognition.stop();
  }
}

function handleCommand(command) {
  if (/start recording/i.test(command) && !isRecording) {
    isRecording = true;
    try {
      startRecording();
    } catch (err) {
      console.error("Error:", err);
      alert("Error: " + err.message);
      return;
    }
    chrome.runtime.sendMessage({ type: "START_RECORDING" });
  } else if (/stop recording/i.test(command) && isRecording) {
    isRecording = false;
    stopRecording();
    chrome.runtime.sendMessage({ type: "STOP_RECORDING" });
  }

  chrome.storage.local.set({ isRecording });
  updateButtonState();
}

function startCommandRecognition() {
  commandRecognition = new SpeechRecognition();
  commandRecognition.lang = "en-US";
  commandRecognition.interimResults = false;
  commandRecognition.maxAlternatives = 1;
  commandRecognition.continuous = true;

  commandRecognition.onresult = function (event) {
    const command = event.results[event.resultIndex][0].transcript;
    handleCommand(command);
  };

  commandRecognition.onerror = function (event) {
    console.error("Command recognition error: " + event.error);
  };

  commandRecognition.start();
}

button.addEventListener("click", async () => {
  if (!isRecording) {
    isRecording = true;
    try {
      startRecording();
    } catch (err) {
      console.error("Error:", err);
      alert("Error: " + err.message);
      return;
    }
    chrome.runtime.sendMessage({ type: "START_RECORDING" });
  } else {
    isRecording = false;
    stopRecording();
    chrome.runtime.sendMessage({ type: "STOP_RECORDING" });
  }

  chrome.storage.local.set({ isRecording });
  updateButtonState();
});

function updateButtonState() {
  button.textContent = isRecording ? "Stop Recording" : "Start Recording";
  button.className = isRecording ? "recording" : "";
}

// Start command recognition when the script loads
startCommandRecognition();
