"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const playwrightGenerator_1 = require("../services/generator/playwrightGenerator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const latestRecording = await database_1.default.recording.findFirst({
            where: {
                userId: req.userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const recordingSteps = [];
        if (latestRecording) {
            try {
                const events = (Array.isArray(latestRecording.events)
                    ? latestRecording.events
                    : []);
                recordingSteps.push(...events.map((event, index) => ({
                    id: `${latestRecording.id}-${index}`,
                    action: event.type || "Unknown",
                    selector: event.selector ||
                        event.url ||
                        "No selector",
                    value: event.text || "",
                    timestamp: event.timestamp || null,
                    duration: `${index + 1}s`,
                    status: event.selector
                        ?.includes("role=")
                        ? "optimized"
                        : "healed",
                })));
            }
            catch {
                console.log("Failed to parse events");
            }
        }
        res.json({
            success: true,
            data: {
                recordingSteps,
                generatedScript: latestRecording
                    ? await (0, playwrightGenerator_1.generatePlaywrightCode)((Array.isArray(latestRecording.events)
                        ? latestRecording.events
                        : []), latestRecording.id)
                    : "// No script generated"
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Recording fetch failed",
        });
    }
});
exports.default = router;
//# sourceMappingURL=recordings.routes.js.map