import axios from "axios";

const owner =
  process.env.GITHUB_OWNER!;

const repo =
  process.env.GITHUB_REPO!;

const token =
  process.env.GITHUB_TOKEN!;

const githubApi =
  axios.create({
    baseURL:
      "https://api.github.com",
    headers: {
      Authorization:
        `Bearer ${token}`,
      Accept:
        "application/vnd.github+json",
    },
  });

export async function getWorkflowRuns() {

  const response =
    await githubApi.get(
      `/repos/${owner}/${repo}/actions/runs`
    );

  return response.data.workflow_runs;
}