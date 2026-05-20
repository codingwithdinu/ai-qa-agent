"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const server_1 = require("../server");
const router = (0, express_1.Router)();
router.post("/github", async (req, res) => {
    try {
        const event = req.headers["x-github-event"];
        const payload = req.body;
        /**
         * ONLY HANDLE workflow_run EVENTS
         */
        if (event !== "workflow_run") {
            return res.status(200).json({
                success: true,
                message: "Event ignored",
            });
        }
        const workflowRun = payload.workflow_run;
        if (!workflowRun) {
            return res.status(400).json({
                success: false,
                message: "No workflow_run payload",
            });
        }
        /**
         * FIND RECORDING
         */
        const recording = await database_1.default.recording.findFirst();
        if (!recording) {
            return res.status(404).json({
                success: false,
                message: "No recording found",
            });
        }
        /**
         * SAVE EXECUTION
         */
        const existingExecution = await database_1.default.testExecution.findFirst({
            where: {
                githubRunId: workflowRun.id.toString(),
            },
        });
        if (existingExecution) {
            await database_1.default.testExecution.update({
                where: {
                    id: existingExecution.id,
                },
                data: {
                    status: workflowRun.conclusion === "success"
                        ? "PASSED"
                        : workflowRun.conclusion === "failure"
                            ? "FAILED"
                            : "RUNNING",
                    duration: workflowRun.run_started_at &&
                        workflowRun.updated_at
                        ? (new Date(workflowRun.updated_at).getTime() -
                            new Date(workflowRun.run_started_at).getTime()) / 1000
                        : 0,
                    logs: workflowRun.display_title ||
                        "",
                    branch: workflowRun.head_branch || "main",
                    commitMessage: workflowRun.head_commit?.message ||
                        workflowRun.display_title ||
                        "",
                },
            });
        }
        else {
            await database_1.default.testExecution.create({
                data: {
                    recordingId: recording.id,
                    githubRunId: workflowRun.id.toString(),
                    status: workflowRun.conclusion === "success"
                        ? "PASSED"
                        : workflowRun.conclusion === "failure"
                            ? "FAILED"
                            : "RUNNING",
                    healedCount: 0,
                    duration: workflowRun.run_started_at &&
                        workflowRun.updated_at
                        ? (new Date(workflowRun.updated_at).getTime() -
                            new Date(workflowRun.run_started_at).getTime()) / 1000
                        : 0,
                    logs: workflowRun.display_title ||
                        JSON.stringify(payload),
                    provider: "GitHub Actions",
                    branch: workflowRun.head_branch || "main",
                    environment: "production",
                    repository: payload.repository?.full_name || "",
                    workflowName: workflowRun.name || "",
                    actor: workflowRun.actor?.login || "",
                    commitMessage: workflowRun.head_commit?.message ||
                        workflowRun.display_title ||
                        "",
                    commitHash: workflowRun.head_sha || "",
                    buildNumber: workflowRun.run_number
                        ? workflowRun.run_number.toString()
                        : "",
                },
            });
        }
        server_1.io.emit("notification", {
            type: "pipeline",
            title: workflowRun.conclusion === "success"
                ? "Pipeline Passed"
                : "Pipeline Failed",
            message: `${workflowRun.name} - ${workflowRun.conclusion}`,
            createdAt: new Date(),
        });
        server_1.io.emit("dashboard-updated");
        server_1.io.emit("pipeline-updated", {
            status: workflowRun.conclusion === "success"
                ? "PASSED"
                : workflowRun.conclusion === "failure"
                    ? "FAILED"
                    : "RUNNING",
            workflow: workflowRun.name,
            repository: payload.repository?.full_name,
            branch: workflowRun.head_branch,
        });
        return res.json({
            success: true,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Webhook processing failed",
        });
    }
});
exports.default = router;
//# sourceMappingURL=webhook.routes.js.map