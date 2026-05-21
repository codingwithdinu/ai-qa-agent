"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const recorder_service_1 = __importDefault(require("../services/recorder/recorder.service"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const record_controller_1 = require("../controllers/record.controller");
const router = (0, express_1.Router)();
const recorderCors = (0, cors_1.default)({
    origin: true,
    credentials: false,
});
/**
 * Save recording events
 */
router.post("/", record_controller_1.createRecording);
/**
 * List recordings
 */
router.get("/", auth_middleware_1.authMiddleware, record_controller_1.listRecordings);
/**
 * Start Playwright recording browser
 */
router.post("/start", auth_middleware_1.authMiddleware, record_controller_1.startRecording);
/**
 * Stop recording
 */
router.post("/stop", auth_middleware_1.authMiddleware, record_controller_1.stopRecording);
/**
 * Serve recorder injector script
 */
router.get("/injector.js", recorderCors, (_req, res) => {
    try {
        const injectorPath = path_1.default.resolve(process.cwd(), "src", "services", "recorder", "injector.js");
        const injectorScript = fs_1.default.readFileSync(injectorPath, "utf8");
        res.setHeader("Content-Type", "application/javascript");
        res.setHeader("Cache-Control", "no-store");
        return res.send(injectorScript);
    }
    catch (error) {
        console.error("Failed to load injector script", error);
        return res.status(500).json({
            success: false,
            message: "Injector not available",
        });
    }
});
/**
 * Receive browser events
 */
router.options("/event", recorderCors);
router.post("/event", recorderCors, async (req, res) => {
    try {
        const { recordingId, event } = req.body;
        if (!recordingId) {
            return res.status(400).json({
                success: false,
                message: "recordingId required",
            });
        }
        if (!event) {
            return res.status(400).json({
                success: false,
                message: "event required",
            });
        }
        await recorder_service_1.default.addEventToRecording(recordingId, event);
        console.log("🎯 Event Saved:", event);
        return res.json({
            success: true,
        });
    }
    catch (error) {
        console.error(error);
        if (error?.message ===
            "Recording not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
        });
    }
});
exports.default = router;
//# sourceMappingURL=record.routes.js.map