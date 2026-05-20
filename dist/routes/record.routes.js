"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recorder_service_1 = __importDefault(require("../services/recorder/recorder.service"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const record_controller_1 = require("../controllers/record.controller");
const router = (0, express_1.Router)();
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
 * Receive browser events
 */
router.post("/event", async (req, res) => {
    try {
        const { recordingId, event } = req.body;
        await recorder_service_1.default.addEventToRecording(recordingId, event);
        console.log("🎯 Event Saved:", event);
        return res.json({
            success: true,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
        });
    }
});
exports.default = router;
//# sourceMappingURL=record.routes.js.map