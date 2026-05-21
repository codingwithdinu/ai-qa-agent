document.addEventListener(
  "click",
  async (e) => {

    const result =
      await chrome.storage.local.get(
        "recording"
      );

    if (!result.recording) return;

    const element = e.target;

    const payload = {

      type: "click",

      tag: element.tagName,

      text: element.innerText,

      id: element.id,

      className: element.className,

      url: window.location.href,

      timestamp: Date.now(),

    };

    console.log(
      "Captured:",
      payload
    );

    await fetch(
      "https://YOUR_BACKEND_URL/api/record/event",
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          recordingId:
            localStorage.getItem(
              "recordingId"
            ),
          event: payload,
        }),
      }
    );
  }
);