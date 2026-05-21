document.getElementById("start").addEventListener("click", async () => {
  const response = await fetch(
    "https://ai-qa-agent-1.onrender.com/api/record/start",
    {
      method: "POST",
    },
  );

  const data = await response.json();

  await chrome.storage.local.set({
    recording: true,
    recordingId: data.recordingId,
  });

  alert("Recording Started");
});

document.getElementById("stop").addEventListener("click", async () => {
  await chrome.storage.local.set({
    recording: false,
    recordingId: null,
  });

  alert("Recording Stopped");
});
