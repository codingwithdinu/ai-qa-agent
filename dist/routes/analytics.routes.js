"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../config/database"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const executions = await database_1.default.testExecution.findMany({
            where: {
                recording: {
                    userId: req.userId,
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        const totalTests = executions.length;
        const passed = executions.filter((e) => e.status === "PASSED").length;
        const failed = executions.filter((e) => e.status === "FAILED").length;
        const healed = executions.reduce((sum, e) => sum + (e.healedCount || 0), 0);
        const avgDuration = executions.reduce((sum, e) => sum + (e.duration || 0), 0) / (totalTests || 1);
        /**
         * Dashboard Cards
         */
        const dashboardStats = [
            {
                label: "Avg Duration",
                value: `${avgDuration.toFixed(1)}s`,
                delta: "Realtime",
                tone: "amber",
                caption: "Execution speed",
            },
            {
                label: "Total Tests",
                value: `${totalTests}`,
                delta: "Realtime",
                tone: "cyan",
                caption: "Live executions",
            },
            {
                label: "Passed Tests",
                value: `${passed}`,
                delta: `${Math.round((passed / (totalTests || 1)) * 100)}% success`,
                tone: "emerald",
                caption: "Stable pipelines",
            },
            {
                label: "Failed Tests",
                value: `${failed}`,
                delta: `${Math.round((failed / (totalTests || 1)) * 100)}% failed`,
                tone: "rose",
                caption: "Needs review",
            },
            {
                label: "AI Healed",
                value: `${healed}`,
                delta: `${Math.round((healed / (totalTests || 1)))} avg/run`,
                tone: "violet",
                caption: "Self-healed selectors",
            },
        ];
        /**
         * Trend Graph
         */
        const trendData = executions.map((e, index) => ({
            name: `Run ${index + 1}`,
            passed: e.status === "PASSED"
                ? 1
                : 0,
            failed: e.status === "FAILED"
                ? 1
                : 0,
            healed: e.healedCount || 0,
            executionTime: e.duration || 0,
        }));
        /**
         * Healing Graph
         */
        const healingTrend = executions.map((e, index) => ({
            sprint: `S${index + 1}`,
            attempts: e.healedCount || 0,
            healed: e.healedCount || 0,
            learning: e.healedCount || 0,
        }));
        /**
         * Pie Chart
         */
        const passFailData = [
            {
                name: "Passed",
                value: passed,
                color: "#22d3ee",
            },
            {
                name: "Failed",
                value: failed,
                color: "#ef4444",
            },
            {
                name: "Healed",
                value: healed,
                color: "#8b5cf6",
            },
        ];
        /**
         * Timeline
         */
        const executionTimeline = executions.map((e, index) => ({
            time: `${10 + index}:00`,
            queued: e.status === "QUEUED"
                ? 1
                : 0,
            running: e.status === "RUNNING"
                ? 1
                : 0,
            completed: e.status === "PASSED"
                ? 1
                : 0,
        }));
        /**
         * Live Activities
         */
        const liveActivities = executions.map((e) => ({
            id: e.id,
            title: `Execution ${e.status}`,
            detail: e.logs?.slice(0, 120) ||
                "No logs",
            type: e.healedCount > 0
                ? "heal"
                : e.status === "FAILED"
                    ? "pipeline"
                    : "run",
            status: e.status === "FAILED"
                ? "warning"
                : "success",
            actor: "AI QA Agent",
            time: new Date(e.createdAt).toLocaleTimeString(),
        }));
        const healingCandidates = executions.map((e) => ({
            id: e.id,
            page: e.recordingId,
            originalSelector: "#loginBtn",
            healedSelector: e.healedCount > 0
                ? "#submitBtn"
                : "#loginBtn",
            confidence: Math.min(95, (e.healedCount || 0) * 20),
            domSimilarity: Math.min(100, (e.healedCount || 0) * 25),
            reasoning: e.logs || "No logs",
            impact: `${e.healedCount} selectors healed`,
            status: e.healedCount > 0
                ? "Applied"
                : "Pending",
        }));
        /**
         * Response
         */
        res.json({
            success: true,
            data: {
                dashboardStats,
                trendData,
                healingTrend,
                passFailData,
                executionTimeline,
                liveActivities,
                healingCandidates,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Analytics failed",
        });
    }
});
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map