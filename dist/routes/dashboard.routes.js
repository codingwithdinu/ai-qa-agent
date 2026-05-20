"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const recordingFormatter_1 = require("../utils/recordingFormatter");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, async (req, res) => {
    const recordings = await database_1.default.recording.findMany({
        where: {
            userId: req.userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    const allEvents = recordings.flatMap((r) => {
        try {
            return JSON.parse(r.events || "[]");
        }
        catch {
            return [];
        }
    });
    const recordingSteps = (0, recordingFormatter_1.formatRecordingEvents)(allEvents);
    const totalRuns = await database_1.default.testRun.count({
        where: {
            recording: {
                userId: req.userId,
            },
        },
    });
    const totalRecordings = await database_1.default.recording.count({
        where: {
            userId: req.userId,
        },
    });
    res.json({
        success: true,
        data: {
            releaseConfidence: 92,
            aiActions: 128,
            repairTime: 4,
            pipelineCoverage: totalRuns,
            recordings: totalRecordings,
            recordingSteps,
        },
    });
});
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map