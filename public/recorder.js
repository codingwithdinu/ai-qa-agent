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
    await fetch("http://localhost:5000/api/record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("✅ Event recorded");
  } catch (error) {
    console.error("❌ Recording failed", error);
  }
});