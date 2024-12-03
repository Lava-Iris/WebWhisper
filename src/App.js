import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [transcription, setTranscription] = useState(
    "[No speech detected yet]"
  );
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const listener = (message) => {
      if (message.type === "UPDATE_TRANSCRIPTION") {
        setTranscription(message.transcription);
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const toggleRecording = () => {
    if (!isRecording) {
      chrome.runtime.sendMessage({ type: "START_RECORDING" });
    } else {
      chrome.runtime.sendMessage({ type: "STOP_RECORDING" });
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="App">
      <button
        className={isRecording ? "recording" : ""}
        onClick={toggleRecording}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <div className="transcription-box">{transcription}</div>
    </div>
  );
}

export default App;
