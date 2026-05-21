console.log("EXTENSION LOADED");

const API_URL =
  "https://ai-qa-agent-1.onrender.com";

document.addEventListener(
  "click",
  async (event) => {

    const target =
      event.target;

    if (!target) return;

    const state =
      await chrome.storage.local.get([
        "recording",
        "recordingId",
      ]);

    console.log("STATE:", state);

    if (!state.recording) {
      console.log("Recording OFF");
      return;
    }

    if (!state.recordingId) {
      console.log("No recordingId");
      return;
    }

    const payload = {
      recordingId:
        state.recordingId,

      event: {
        type: "click",

        selector:
          target.id
            ? `#${target.id}`
            : target.tagName.toLowerCase(),

        text:
          target.innerText || "",

        timestamp:
          Date.now(),

        url:
          window.location.href,
      },
    };

    console.log(
      "Captured Event:",
      payload
    );

    try {

      const response =
        await fetch(
          `${API_URL}/api/record/event`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(payload),
          }
        );

      const data =
        await response.json();

      console.log(
        "EVENT SAVED:",
        data
      );

    } catch (error) {

      console.error(
        "Recording failed",
        error
      );
    }
  },
  true
);