"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkflowRuns = getWorkflowRuns;
const axios_1 = __importDefault(require("axios"));
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;
const githubApi = axios_1.default.create({
    baseURL: "https://api.github.com",
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
    },
});
async function getWorkflowRuns() {
    const response = await githubApi.get(`/repos/${owner}/${repo}/actions/runs`);
    return response.data.workflow_runs;
}
//# sourceMappingURL=github.service.js.map