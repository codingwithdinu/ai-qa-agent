document.addEventListener("click", async (event) => {
  const target = event.target;

  const payload = {
    events: [
      {
        type: "click",
        selector: target.id
          ? `#${target.id}`
          : target.tagName.toLowerCase(),
        timestamp: Date.now(),
      },
    ],
  };

  try {
    await fetch("https://ai-qa-agent-1.onrender.com/api/record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

  } catch (error) {
    console.error("❌ Recording failed", error);
  }
});