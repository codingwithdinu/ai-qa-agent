console.log("EXTENSION LOADED");

const MESSAGE_SOURCE = "ai-qa-recorder";

window.addEventListener(
  "message",
  (event) => {
    if (event.source !== window) return;

    const data = event.data;
    if (!data || data.source !== MESSAGE_SOURCE) {
      return;
    }

    const payload = data.payload;
    if (!payload) return;

    const replyPort = event.ports?.[0];

    chrome.runtime.sendMessage(payload, () => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        console.error(
          "Recorder bridge failed",
          lastError
        );
        replyPort?.postMessage({
          ok: false,
          error: lastError.message,
        });
        return;
      }
      replyPort?.postMessage({ ok: true });
    });
  }
);

const API_URL =
  "https://ai-qa-agent-1.onrender.com";

function normalizeText(value) {
  return (value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function getBestSelector(element) {
  if (!element) {
    return "unknown";
  }

  const tag = element.tagName.toLowerCase();

  const testId = element.getAttribute(
    "data-testid"
  );
  if (testId) {
    return `[data-testid="${testId}"]`;
  }

  if (element.id && element.id.trim() !== "") {
    return `#${element.id}`;
  }

  const aria =
    element.getAttribute("aria-label");
  if (aria) {
    return `${tag}[aria-label="${aria}"]`;
  }

  const name = element.getAttribute("name");
  if (name) {
    return `${tag}[name="${name}"]`;
  }

  const placeholder =
    element.getAttribute("placeholder");
  if (placeholder) {
    return `${tag}[placeholder="${placeholder}"]`;
  }

  const href = element.getAttribute("href");
  if (tag === "a" && href) {
    return `a[href="${href}"]`;
  }

  const text = normalizeText(element.innerText);
  const safeText = text.replace(/"/g, '\\"');

  if (
    (tag === "a" || tag === "button") &&
    text &&
    text.length < 40
  ) {
    if (tag === "a") {
      return `role=link[name="${safeText}"]`;
    }

    if (tag === "button") {
      return `role=button[name="${safeText}"]`;
    }
  }

  if (
    element.className &&
    typeof element.className === "string"
  ) {
    const classes = element.className
      .trim()
      .split(" ")
      .filter(
        (cls) =>
          cls &&
          !cls.includes(":") &&
          !cls.includes("hover") &&
          !cls.includes("active") &&
          cls.length < 40
      )
      .slice(0, 3)
      .join(".");
    if (classes) {
      return `${tag}.${classes}`;
    }
  }

  if (text && text.length < 40) {
    return `text=${safeText}`;
  }

  return tag;
}

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
        "recordingUrl",
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

    if (state.recordingUrl) {
      try {
        const allowedOrigin =
          new URL(
            state.recordingUrl
          ).origin;
        if (
          window.location.origin !==
          allowedOrigin
        ) {
          return;
        }
      } catch (error) {
        console.error(
          "Invalid recordingUrl",
          error
        );
      }
    }

    let resolvedTarget = target;
    const badTags = [
      "svg",
      "path",
      "span",
      "i",
    ];
    if (
      badTags.includes(
        resolvedTarget.tagName?.toLowerCase()
      )
    ) {
      const clickableParent =
        resolvedTarget.closest(
          "button, a, [role='button']"
        );
      if (clickableParent) {
        resolvedTarget = clickableParent;
      }
    }

    const payload = {
      recordingId:
        state.recordingId,

      event: {
        type: "click",

        selector:
          getBestSelector(resolvedTarget),

        text:
          resolvedTarget.innerText || "",

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