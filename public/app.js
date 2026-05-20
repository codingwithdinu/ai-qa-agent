(() => {
  const API_BASE = "/api";
  const state = {
    token: null,
    recordingId: null,
    generatedCases: "",
    testRunId: null,
    reportMarkdown: "",
    logsConnected: false,
  };

  const elements = {
    logConsole: document.getElementById("logConsole"),
    progressFill: document.getElementById("progressFill"),
    statusDot: document.getElementById("statusDot"),
    statusLabel: document.getElementById("statusLabel"),
    statusMessage: document.getElementById("statusMessage"),
    recordingArtifact: document.getElementById("recordingArtifact"),
    casesArtifact: document.getElementById("casesArtifact"),
    resultsArtifact: document.getElementById("resultsArtifact"),
    reportArtifact: document.getElementById("reportArtifact"),
  };

  function appendLog(level, message) {
    const logEntry = document.createElement("div");
    logEntry.className = "log-entry";
    const time = new Date().toLocaleTimeString();
    logEntry.innerHTML = `
      <div class="log-time">${time}</div>
      <div class="log-level ${level}">${level.toUpperCase()}</div>
      <div class="log-message">${message}</div>
    `;
    elements.logConsole.appendChild(logEntry);
    elements.logConsole.scrollTop = elements.logConsole.scrollHeight;
  }

  function setStatus(step, message, progress, running = true) {
    elements.progressFill.style.width = `${progress}%`;
    elements.statusDot.classList.toggle("running", running);
    elements.statusLabel.textContent = step.toUpperCase();
    elements.statusMessage.textContent = message;
  }

  function setIdle(message = "Ready") {
    elements.statusDot.classList.remove("running");
    elements.statusLabel.textContent = "IDLE";
    elements.statusMessage.textContent = message;
    elements.progressFill.style.width = "0%";
  }

  function setArtifact(element, available) {
    element.className = `artifact-item ${available ? "available" : "unavailable"}`;
  }

  async function requestJson(url, options = {}) {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });

    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      const message =
        data?.message || data?.error || `Request failed (${response.status})`;
      throw new Error(message);
    }

    return data;
  }

  function getSampleEvents() {
    return [
      { type: "navigate", url: window.location.origin, timestamp: Date.now() },
      { type: "wait", ms: 500, timestamp: Date.now() + 1 },
      { type: "screenshot", timestamp: Date.now() + 2 },
    ];
  }

  async function updateState() {
    try {
      const response = await requestJson(`${API_BASE}/state`, {
        method: "GET",
      });
      const backendState = response.data || response;

      setArtifact(
        elements.recordingArtifact,
        Boolean(state.recordingId || backendState.artifacts?.recording),
      );
      setArtifact(
        elements.casesArtifact,
        Boolean(state.generatedCases || backendState.artifacts?.cases),
      );
      setArtifact(
        elements.resultsArtifact,
        Boolean(state.testRunId || backendState.artifacts?.results),
      );
      setArtifact(
        elements.reportArtifact,
        Boolean(state.reportMarkdown || backendState.artifacts?.report),
      );

      if (!backendState.isRunning) {
        setIdle(backendState.message || "Backend ready");
      }
    } catch (error) {
      console.error("Failed to update state:", error);
      setIdle("Backend unavailable");
    }
  }

  function connectLogs() {
    if (state.logsConnected) return;

    try {
      const eventSource = new EventSource(`${API_BASE}/logs`);
      state.logsConnected = true;

      eventSource.onmessage = (event) => {
        try {
          const entry = JSON.parse(event.data);
          appendLog(entry.level || "info", entry.message || String(event.data));
        } catch {
          appendLog("info", String(event.data));
        }
      };

      eventSource.onerror = () => {
        state.logsConnected = false;
        appendLog("warn", "Log stream disconnected, retrying in 3 seconds");
        eventSource.close();
        setTimeout(connectLogs, 3000);
      };
    } catch (error) {
      appendLog("warn", "Could not connect to live log stream");
    }
  }

  async function startLogin() {
    const email = window.prompt("Email for login", "qa@example.com");
    if (!email) return;
    const name =
      window.prompt("Name for signup", "QA Engineer") || "QA Engineer";
    const password = window.prompt("Password", "password123");
    if (!password) return;

    setStatus("login", "Creating user session...", 10);

    try {
      await requestJson(`${API_BASE}/auth/signup`, {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      });
    } catch (signupError) {
      appendLog("warn", `Signup skipped: ${signupError.message}`);
    }

    try {
      const login = await requestJson(`${API_BASE}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      state.token = login.token || null;
      appendLog("success", `Logged in as ${email}`);
      setStatus("login", "Authenticated", 20, true);
    } catch (error) {
      appendLog("error", `Login failed: ${error.message}`);
      throw error;
    }
  }

  async function startRecording() {
    try {
      setStatus("record", "Launching browser...", 40);

      const response = await requestJson(`${API_BASE}/record/start`, {
        method: "POST",
        body: JSON.stringify({
          sessionId: "dashboard-session",
          url: "https://ai-qa-agent-1.onrender.com/test.html",
        }),
      });

      appendLog("success", "Recording browser started");

      await updateState();
    } catch (error) {
      appendLog("error", error.message);
    }
  }

  async function generateCases() {
    const recordingId = state.recordingId || window.prompt("Recording ID", "");
    const prompt =
      window.prompt(
        "AI prompt",
        "Generate Playwright test cases from the latest recording.",
      ) || "Generate Playwright test cases from the latest recording.";

    if (!recordingId) {
      appendLog("warn", "No recording selected");
      return;
    }

    setStatus("generate", "Generating cases...", 60);

    const response = await requestJson(`${API_BASE}/ai/generate`, {
      method: "POST",
      body: JSON.stringify({
        prompt: `${prompt}\nRecording ID: ${recordingId}`,
      }),
    });

    state.generatedCases =
      response?.data || response?.message || JSON.stringify(response, null, 2);
    appendLog("success", "Generated AI test cases");
    openTextWindow("Generated Test Cases", String(state.generatedCases));
    await updateState();
  }

  async function runTests() {
    const recordingId = state.recordingId || window.prompt("Recording ID", "");
    if (!recordingId) {
      appendLog("warn", "No recording selected");
      return;
    }

    setStatus("run", "Running tests...", 80);

    const response = await requestJson(`${API_BASE}/test/run`, {
      method: "POST",
      body: JSON.stringify({ recordingId }),
    });

    state.testRunId = response?.data?.id || response?.data?.runId || null;
    appendLog(
      "success",
      `Test execution complete${state.testRunId ? ` (${state.testRunId})` : ""}`,
    );
    await updateState();
  }

  async function generateReport() {
    setStatus("report", "Building report...", 95);

    const response = await requestJson(`${API_BASE}/report/markdown`, {
      method: "GET",
    });

    state.reportMarkdown =
      response?.data || response?.message || JSON.stringify(response, null, 2);
    appendLog("success", "Markdown report generated");
    openTextWindow("Markdown Report", String(state.reportMarkdown));
    await updateState();
    setStatus("report", "Report ready", 100, false);
  }

  async function runFullPipeline() {
    try {
      await startLogin();
      await startRecording();
      await generateCases();
      await runTests();
      await generateReport();
      setIdle("Pipeline complete");
      appendLog("success", "Full pipeline completed");
    } catch (error) {
      appendLog("error", error.message || "Pipeline failed");
      setIdle("Pipeline failed");
    }
  }

  function openTextWindow(title, content) {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<!DOCTYPE html><html><head><title>${title}</title><style>body{font-family:monospace;padding:24px;background:#0f172a;color:#e2e8f0}pre{white-space:pre-wrap;word-break:break-word;background:#111827;padding:16px;border-radius:8px;border:1px solid #334155}</style></head><body><h1>${title}</h1><pre>${escapeHtml(content)}</pre></body></html>`,
    );
    win.document.close();
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  async function openArtifact(name) {
    if (name === "recordings") {
      const response = await requestJson(`${API_BASE}/record`, {
        method: "GET",
      });
      openTextWindow("Recordings", JSON.stringify(response, null, 2));
      return;
    }

    if (name === "cases") {
      openTextWindow(
        "Generated Test Cases",
        state.generatedCases || "No generated test cases yet.",
      );
      return;
    }

    if (name === "reports/results.json") {
      const response = await requestJson(`${API_BASE}/test`, { method: "GET" });
      openTextWindow("Test Results", JSON.stringify(response, null, 2));
      return;
    }

    if (name === "reports/report.html") {
      const response = await requestJson(`${API_BASE}/report/markdown`, {
        method: "GET",
      });
      openTextWindow("Report", String(response?.data || response));
      return;
    }
  }

  window.startLogin = startLogin;
  window.startRecording = startRecording;
  window.generateCases = generateCases;
  window.runTests = runTests;
  window.generateReport = generateReport;
  window.runFullPipeline = runFullPipeline;
  window.openArtifact = openArtifact;
  window.startRecording = startRecording;

  document.addEventListener("DOMContentLoaded", () => {
    const recordBtn = document.getElementById("recordBtn");

    recordBtn?.addEventListener("click", startRecording);
  });

  connectLogs();
  updateState();
  setInterval(updateState, 5000);
})();
