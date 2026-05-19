(() => {
  window.__qaRecorderLoaded = true;

  console.log("🎥 Recorder Active");

  window.sendRecordedEvent({
    type: "navigate",
    url: window.location.href,
    timestamp: Date.now(),
  });

  function getBestSelector(element) {
    if (!element) {
      return "unknown";
    }

    const tag = element.tagName.toLowerCase();

    /**
     * 1. data-testid
     */
    const testId = element.getAttribute("data-testid");

    if (testId) {
      return `[data-testid="${testId}"]`;
    }

    /**
     * 2. ID
     */
    if (element.id && element.id.trim() !== "") {
      return `#${element.id}`;
    }

    /**
     * 3. aria-label
     */
    const aria = element.getAttribute("aria-label");

    if (aria) {
      return `${tag}[aria-label="${aria}"]`;
    }

    /**
     * 4. name
     */
    const name = element.getAttribute("name");

    if (name) {
      return `${tag}[name="${name}"]`;
    }

    /**
     * 5. placeholder
     */
    const placeholder = element.getAttribute("placeholder");

    if (placeholder) {
      return `${tag}[placeholder="${placeholder}"]`;
    }

    /**
     * 6. Links + buttons → role selector
     */
    const text = element.innerText?.trim()?.replace(/\s+/g, " ");

    if ((tag === "a" || tag === "button") && text && text.length < 40) {
      if (tag === "a") {
        return `role=link[name="${text}"]`;
      }

      if (tag === "button") {
        return `role=button[name="${text}"]`;
      }
    }

    /**
     * 7. Stable classes
     */
    if (element.className && typeof element.className === "string") {
      const classes = element.className

        .trim()

        .split(" ")

        .filter(
          (cls) =>
            cls &&
            !cls.includes(":") &&
            !cls.includes("hover") &&
            !cls.includes("active") &&
            cls.length < 40,
        )

        .slice(0, 3)

        .join(".");

      if (classes) {
        return `${tag}.${classes}`;
      }
    }

    /**
     * 8. Text fallback
     */
    if (text && text.length < 40) {
      return `text=${text}`;
    }

    /**
     * 9. Final fallback
     */
    return tag;
  }
  /**
   * CLICK TRACKING
   */
  document.addEventListener(
    "click",

    async (event) => {
      let target = event.target;
      const badTags = ["svg", "path", "span", "i"];

      if (badTags.includes(target.tagName?.toLowerCase())) {
        const clickableParent = target.closest("button, a, [role='button']");

        if (clickableParent) {
          target = clickableParent;
        }
      }
      if (!target) return;

      await window.sendRecordedEvent({
        type: "click",

        selector: getBestSelector(target),

        timestamp: Date.now(),
      });
    },

    true,
  );

  /**
   * INPUT TRACKING
   */
  document.addEventListener(
    "input",

    async (event) => {
      const target = event.target;

      if (!target) return;

      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        await window.sendRecordedEvent({
          type: "input",

          selector: getBestSelector(target),

          value: target.value,

          timestamp: Date.now(),
        });
      }
    },

    true,
  );
})();
