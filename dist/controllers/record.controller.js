"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecording = createRecording;
exports.listRecordings = listRecordings;
exports.startRecording = startRecording;
exports.stopRecording = stopRecording;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const recorder_service_1 = __importDefault(require("../services/recorder/recorder.service"));
async function createRecording(req, res) {
    const { events, sessionId, workspaceId, } = req.body;
    if (!events || !Array.isArray(events))
        return res
            .status(400)
            .json({ success: false, message: "events array required" });
    if (!workspaceId) {
        return res.status(400).json({
            success: false,
            message: "Workspace required",
        });
    }
    // persist to database
    const created = await database_1.default.recording.create({
        data: {
            id: (0, uuid_1.v4)(),
            sessionId: sessionId || null,
            events: events,
            userId: req.userId,
            workspaceId: req.body.workspaceId,
        },
    });
    return res.status(201).json({
        success: true,
        data: {
            ...created,
            events: created.events,
        },
    });
}
async function listRecordings(req, res) {
    const recs = await database_1.default.recording.findMany({
        where: {
            userId: req.userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return res.status(200).json({
        success: true,
        data: recs.map((recording) => ({
            ...recording,
            events: recording.events,
        })),
    });
}
async function startRecording(req, res) {
    try {
        const { sessionId, url, workspaceId, clientMode } = req.body;
        if (!workspaceId) {
            return res.status(400).json({
                success: false,
                message: "Workspace required",
            });
        }
        const membership = await database_1.default.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId: req.userId,
            },
        });
        if (!membership) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized workspace",
            });
        }
        const recordingId = await recorder_service_1.default.startRecording(sessionId, url, req.userId, workspaceId, {
            launchBrowser: !clientMode,
        });
        return res.status(200).json({
            success: true,
            recordingId,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
async function stopRecording(req, res) {
    try {
        const recordingId = req.body.recordingId;
        const recording = await recorder_service_1.default.stopRecording(recordingId);
        /**
         * Auto generate + execute test
         * in background
         */
        setTimeout(async () => {
            try {
                const baseUrl = process.env.API_BASE_URL ||
                    "https://ai-qa-agent-1.onrender.com";
                await fetch(`${baseUrl}/api/test/generate/${recording.id}`, {
                    method: "POST",
                });
                await fetch(`${baseUrl}/api/test/execute/${recording.id}`, {
                    method: "POST",
                });
            }
            catch (error) {
                console.error("❌ Background generation failed", error);
            }
        }, 100);
        return res.json({
            success: true,
            recordingId: recording.id,
            data: recording,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to stop recording",
        });
    }
}
exports.default = {
    createRecording,
    listRecordings,
    startRecording,
    stopRecording,
};
//# sourceMappingURL=record.controller.js.map