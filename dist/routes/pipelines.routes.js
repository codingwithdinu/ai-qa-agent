"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const github_service_1 = require("../services/github/github.service");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        /**
         * LOCAL EXECUTIONS
         */
        const executions = await database_1.default.testExecution.findMany({
            where: {
                recording: {
                    userId: req.userId,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        /**
         * REAL GITHUB ACTIONS
         */
        const workflowRuns = await (0, github_service_1.getWorkflowRuns)();
        /**
         * GITHUB PIPELINES
         */
        const githubPipelines = workflowRuns.map((run) => ({
            id: run.id.toString(),
            provider: "GitHub Actions",
            branch: run.head_branch ||
                "main",
            environment: run.head_branch === "main"
                ? "production"
                : "staging",
            status: run.status ===
                "in_progress"
                ? "Running"
                : run.conclusion ===
                    "success"
                    ? "Passing"
                    : run.conclusion ===
                        "failure"
                        ? "Failed"
                        : "Queued",
            duration: run.run_started_at
                ? `${Math.round((new Date(run.updated_at).getTime() -
                    new Date(run.run_started_at).getTime()) / 1000)}s`
                : "0s",
            qaGate: run.conclusion ===
                "failure"
                ? "Blocked"
                : "Passed",
            health: run.conclusion ===
                "failure"
                ? "critical"
                : "healthy",
        }));
        /**
         * LOCAL EXECUTIONS
         */
        const localPipelines = executions.map((e) => ({
            id: e.id,
            provider: "Local Runner",
            branch: "main",
            environment: "development",
            status: e.status === "PASSED"
                ? "Passing"
                : e.status ===
                    "FAILED"
                    ? "Failed"
                    : "Running",
            duration: `${e.duration || 0}s`,
            qaGate: e.status ===
                "FAILED"
                ? "Blocked"
                : e.healedCount > 0
                    ? "AI Healed"
                    : "Passed",
            health: e.status ===
                "FAILED"
                ? "critical"
                : e.healedCount > 0
                    ? "warning"
                    : "healthy",
        }));
        /**
         * MERGED PIPELINES
         */
        const pipelineItems = [
            ...githubPipelines,
            ...localPipelines,
        ];
        /**
         * TIMELINE
         */
        const deploymentTimeline = workflowRuns.map((run) => ({
            id: run.id.toString(),
            stage: run.conclusion ===
                "success"
                ? "Deployment Complete"
                : run.conclusion ===
                    "failure"
                    ? "Deployment Failed"
                    : "Deployment Running",
            status: run.conclusion ===
                "success"
                ? "complete"
                : "active",
            detail: `${run.name} • ${run.head_branch}`,
        }));
        res.json({
            success: true,
            data: {
                pipelineItems,
                deploymentTimeline,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Pipeline analytics failed",
        });
    }
});
exports.default = router;
//# sourceMappingURL=pipelines.routes.js.map