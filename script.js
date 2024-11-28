// Check if the browser supports SpeechRecognition (Web Speech API)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Speech Recognition is not supported in this browser.");
}

let recognition;
let isListening = false;
let timeout;

const startStopButton = document.getElementById('startStopButton');
const outputDiv = document.getElementById('output');

// Initialize the speech recognition
function initializeRecognition() {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';  // Set language to English
  recognition.interimResults = true; // Show results while speaking
  recognition.maxAlternatives = 1; // Limit alternatives for simplicity

  // Handle interim and final results
  recognition.onresult = function(event) {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    outputDiv.textContent = transcript;
    resetTimeout(); // Reset the timeout whenever we get results
  };

  // Handle when recognition stops
  recognition.onend = function() {
    isListening = false;
    startStopButton.textContent = "Start";
    outputDiv.textContent += "\nSpeech recognition stopped.";
  };

  // Handle any errors
  recognition.onerror = function(event) {
    outputDiv.textContent = "Error: " + event.error;
  };
}

// Start or stop the speech recognition
function toggleRecognition() {
  if (isListening) {
    recognition.stop();
  } else {
    recognition.start();
    isListening = true;
    startStopButton.textContent = "Stop";
    outputDiv.textContent = "Listening...";
  }
}

// Reset the timeout (this is used to stop recognition after a pause)
function resetTimeout() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (isListening) {
      recognition.stop();
      outputDiv.textContent += "\nSpeech recognition stopped due to pause.";
    }
  }, 3000); // Stop after 3 seconds of silence
}

// Set up the button click event
startStopButton.addEventListener('click', toggleRecognition);

// Initialize recognition
initializeRecognition();
