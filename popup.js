let isRecording = false;
const button = document.getElementById('toggleButton');

chrome.storage.local.get(['isRecording'], (result) => {
  isRecording = result.isRecording || false;
  updateButtonState();
});

button.addEventListener('click', async () => {
  if (!isRecording) {
    // First, request microphone permission
    try {

      // Then try to access the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Got stream:', stream);	
      isRecording = true;
      chrome.runtime.sendMessage({ type: 'START_RECORDING', stream });
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Please allow microphone access to use this extension. You may need to click the camera icon in the address bar to allow access.');
      return;
    }
  } else {
    isRecording = false;
    chrome.runtime.sendMessage({ type: 'STOP_RECORDING' });
  }
  
  chrome.storage.local.set({ isRecording });
  updateButtonState();

  // try {
  //   // Request microphone access
  //   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //   console.log("Microphone access granted.");
  //   alert("Microphone access granted!");

  //   // Stop the microphone stream if it's not needed immediately
  //   // stream.getTracks().forEach(track => track.stop());
  // } catch (err) {
  //   console.error("Microphone access denied or an error occurred:", err);
  //   alert(`Error: ${err.message}`);  }
});

function updateButtonState() {
  button.textContent = isRecording ? 'Stop Recording' : 'Start Recording';
  button.className = isRecording ? 'recording' : '';
}