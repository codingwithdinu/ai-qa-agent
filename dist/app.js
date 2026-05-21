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
const reports_routes_1 = __importDefault(require("./routes/reports.routes"));
const test_routes_1 = __importDefault(require("./routes/test.routes"));
const logger_1 = require("./utils/logger");
const execution_routes_1 = __importDefault(require("./routes/execution.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const pipelines_routes_1 = __importDefault(require("./routes/pipelines.routes"));
const recordings_routes_1 = __importDefault(require("./routes/recordings.routes"));
const reports_routes_2 = __importDefault(require("./routes/reports.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
const app_shell_routes_1 = __importDefault(require("./routes/app-shell.routes"));
const assistant_routes_1 = __importDefault(require("./routes/assistant.routes"));
const passport_1 = __importDefault(require("./config/passport"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const healing_routes_1 = __importDefault(require("./routes/healing.routes"));
const results_routes_1 = __importDefault(require("./routes/results.routes"));
const github_routes_1 = __importDefault(require("./routes/github.routes"));
const webhook_routes_1 = __importDefault(require("./routes/webhook.routes"));
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
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing");
}
/**
 * Security Middleware
 */
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
/**
 * Enable CORS
 */
const frontendOrigin = process.env.FRONTEND_URL;
const openRecorderPaths = new Set([
    "/api/record/event",
    "/api/record/injector.js",
]);
app.use((0, cors_1.default)((req, callback) => {
    if (openRecorderPaths.has(req.path)) {
        callback(null, {
            origin: true,
            credentials: false,
        });
        return;
    }
    if (!frontendOrigin) {
        callback(null, {
            origin: true,
            credentials: true,
        });
        return;
    }
    callback(null, {
        origin: frontendOrigin,
        credentials: true,
    });
}));
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
 * Serve Dashboard UI
 */
app.get("/", (_req, res) => {
    res.sendFile(path_1.default.join(publicDir, "index.html"));
});
app.use((0, express_session_1.default)({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV
            === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
/**
 * API Routes
 */
app.use("/api/auth", auth_routes_1.default);
app.use("/api/health", health_routes_1.default);
app.use("/api/ai", ai_routes_1.default);
app.use("/api/record", record_routes_1.default);
app.use("/api/reports", reports_routes_1.default);
app.use("/api/test", test_routes_1.default);
app.use("/api/executions", execution_routes_1.default);
app.use("/api/analytics", analytics_routes_1.default);
app.use("/api/pipelines", pipelines_routes_1.default);
app.use("/api/recordings", recordings_routes_1.default);
app.use("/api/reports", reports_routes_2.default);
app.use("/api/settings", settings_routes_1.default);
app.use("/api/app-shell", app_shell_routes_1.default);
app.use("/api/assistant", assistant_routes_1.default);
app.use((0, cookie_parser_1.default)());
app.use("/api/dashboard", dashboard_routes_1.default);
app.use("/api/healing", healing_routes_1.default);
app.use("/api/test-results", results_routes_1.default);
app.use("/test-results", express_1.default.static(path_1.default.resolve("test-results")));
app.use("/api/github", github_routes_1.default);
app.use("/api/webhooks", webhook_routes_1.default);
app.get("/api/state", async (_req, res) => {
    const recordingCount = await database_1.default.recording.count();
    const testRunCount = await database_1.default.testRun.count();
    const latestRun = await database_1.default.testRun.findFirst({
        orderBy: { startedAt: "desc" },
    });
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