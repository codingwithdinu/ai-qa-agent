import api from "../api/client";

export async function getExecutions() {
  const response = await api.get("/executions");
  return response.data.data;
}

export async function getState() {
  const response = await api.get("/state");
  return response.data.data;
}

export async function executeTest(recordingId: string) {
  const res = await api.post(`/test/execute/${recordingId}`);
  return res.data;
}

export async function generateTest(recordingId: string) {
  const res = await api.post(`/test/generate/${recordingId}`);
  return res.data;
}

export async function getAnalytics() {
  const response = await api.get("/analytics");
  return response.data.data;
}

export async function getPipelines() {
  const response = await api.get("/pipelines");
  return response.data.data;
}

export async function getRecordings() {

  console.log("CALLING RECORDINGS API");

  const response =
    await api.get("/recordings");

  console.log(
    "RECORDINGS API:",
    response.data
  );

  return response.data.data;
}

export async function getReportsData() {
  const response = await api.get("/reports");
  return response.data.data;
}

export async function getSettingsData() {
  const response = await api.get("/settings");
  return response.data.data;
}

export async function getAppShellData() {
  const response = await api.get("/app-shell");
  return response.data.data;
}

export async function getHealingData() {
  const response = await api.get("/healing");
  return response.data.data;
}

export async function getTestResults() {
  const response = await api.get("/test-results");
  return response.data;
}