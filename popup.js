let isRecording = false;
const button = document.getElementById('toggleButton');

chrome.storage.local.get(['isRecording'], (result) => {
  isRecording = result.isRecording || false;
  updateButtonState();
});


let recognition = null;

button.addEventListener('click', async () => {
  if (!isRecording) {
    try {
      isRecording = true;
      console.log('Recording started');
      const transcriptionEl = document.getElementById('transcription');
      if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
        // Initialize the Speech Recognition API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();

        // Set recognition properties
        recognition.lang = "en-US"; // Set language (change as needed)
        recognition.interimResults = true; // Show interim results as the user speaks
        recognition.continuous = true; // Continue recognition until stopped

        recognition.start(); // Start recognition
        // Handle recognition results
        recognition.onresult = event => {
          let last = event.results.length - 1;
          let lastTranscript = event.results[last][0].transcript;
          let interim_transcript = '';
          let final_transcript = '';
          console.log('Got result:', event.results);

          for (var i = event.resultIndex; i < event.results.length; ++i) {
              // Verify if the recognized text is the last with the isFinal property
            if (event.results[i].isFinal) {
              final_transcript += event.results[i][0].transcript;
            } else {
              interim_transcript += event.results[i][0].transcript;
            }
          }
          transcriptionEl.textContent = interim_transcript;
        };
      } else {
        transcriptionEl.textContent = "Speech recognition is not supported in this browser.";
      }
      chrome.runtime.sendMessage({ type: 'START_RECORDING' });
    } catch (err) {
      console.error('Error:', err);
      alert('Error: ' + err.message);
      return;
    }
  } else {
    isRecording = false;
    
    if (recognition) {
      recognition.stop();
    }
    chrome.runtime.sendMessage({ type: 'STOP_RECORDING' });
  }
  
  chrome.storage.local.set({ isRecording });
  updateButtonState();
});

function updateButtonState() {
  button.textContent = isRecording ? 'Stop Recording' : 'Start Recording';
  button.className = isRecording ? 'recording' : '';
}