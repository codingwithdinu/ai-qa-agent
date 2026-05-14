"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("./config/database"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const record_routes_1 = __importDefault(require("./routes/record.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const test_routes_1 = __importDefault(require("./routes/test.routes"));
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
const publicDir = path_1.default.resolve(process.cwd(), "public");
const dashboardState = {
    isRunning: false,
    currentStep: "idle",
    progress: 0,
    message: "Ready",
    artifacts: {
        recording: false,
        cases: false,
        results: false,
        report: false,
    },
};
/**
 * Security Middleware
 */
app.use((0, helmet_1.default)());
/**
 * Enable CORS
 */
app.use((0, cors_1.default)());
/**
 * Logger Middleware
 */
app.use((0, morgan_1.default)("dev"));
/**
 * Body Parsers
 */
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(publicDir));
/**
 * Health Check Route
 */
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI QA Agent Backend Running",
    });
});
/**
 * API Routes
 */
app.use("/api/auth", auth_routes_1.default);
app.use("/api/health", health_routes_1.default);
app.use("/api/ai", ai_routes_1.default);
app.use("/api/record", record_routes_1.default);
app.use("/api/report", report_routes_1.default);
app.use("/api/test", test_routes_1.default);
app.get("/api/state", async (_req, res) => {
    const recordingCount = await database_1.default.recording.count();
    const testRunCount = await database_1.default.testRun.count();
    const latestRun = await database_1.default.testRun.findFirst({ orderBy: { startedAt: "desc" } });
    res.json({
        success: true,
        data: {
            ...dashboardState,
            artifacts: {
                recording: recordingCount > 0,
                cases: recordingCount > 0,
                results: testRunCount > 0,
                report: recordingCount > 0 || testRunCount > 0,
            },
            counts: {
                recordings: recordingCount,
                testRuns: testRunCount,
            },
            latestRunId: latestRun?.id || null,
        },
    });
});
app.get("/api/logs", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();
    const pushLog = (entry) => {
        res.write(`data: ${JSON.stringify(entry)}\n\n`);
    };
    logger_1.logger.on("log", pushLog);
    res.write(`data: ${JSON.stringify({ timestamp: new Date().toISOString(), level: "info", message: "Connected to log stream" })}\n\n`);
    req.on("close", () => {
        logger_1.logger.off("log", pushLog);
        res.end();
    });
});
/**
 * 404 Handler
 */
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map