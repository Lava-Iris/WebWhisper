chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({hide: true}, function() {
    console.log("Voice recorder is on");
  });
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_RECORDING') {
    startRecording();
  } else if (message.type === 'STOP_RECORDING') {
    stopRecording();
  }
});


function startRecording() {
  
}

function stopRecording() {
}
