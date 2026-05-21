chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "START_RECORDING") {
    await chrome.storage.local.set({
      recording: true,
      recordingId: message.recordingId,
    });

    if (message.url) {
      chrome.tabs.create({
        url: message.url,
      });
    }
  }

  if (message.type === "STOP_RECORDING") {
    await chrome.storage.local.set({
      recording: false,
      recordingId: null,
    });
  }
});
