(() => {
  console.log("🎥 QA Recorder Injected");

  document.addEventListener("click", async (event) => {
    const target = event.target;

    const payload = {
      recordingId: window.__recordingId,

      event: {
        type: "click",

        selector: target.id
          ? `#${target.id}`
          : target.tagName.toLowerCase(),

        timestamp: Date.now(),
      },
    };

    try {
      await fetch("http://localhost:5000/api/record/event", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(error);
    }
  });
})();