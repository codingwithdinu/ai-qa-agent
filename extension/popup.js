document
  .getElementById("start")
  .addEventListener("click", async () => {

    await chrome.storage.local.set({
      recording: true
    });

    alert("Recording Started");
  });

document
  .getElementById("stop")
  .addEventListener("click", async () => {

    await chrome.storage.local.set({
      recording: false
    });

    alert("Recording Stopped");
  });