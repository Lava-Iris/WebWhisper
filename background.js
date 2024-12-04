chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({hide: true}, function() {
    console.log("Voice recorder is on");
  });
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

let isRecording = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_RECORDING') {
    isRecording = true;
  } else if (message.type === 'STOP_RECORDING') {
    isRecording = false;
  }
  chrome.storage.local.set({isRecording});
});


chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const { isRecording } = await chrome.storage.local.get('isRecording');
  if (isRecording) {
    chrome.action.openPopup();
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    const { isRecording } = await chrome.storage.local.get("isRecording");
    if (isRecording) {
      chrome.action.openPopup(); // Open the popup automatically
    }
  }
});