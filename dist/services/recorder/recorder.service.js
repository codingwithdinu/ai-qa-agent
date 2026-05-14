"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startRecording = startRecording;
exports.addEventToRecording = addEventToRecording;
exports.stopRecording = stopRecording;
exports.getRecording = getRecording;
exports.listRecordings = listRecordings;
const logger_1 = require("../../utils/logger");
const database_1 = __importDefault(require("../../config/database"));
const uuid_1 = require("uuid");
/**
 * Start recording browser session
 */
async function startRecording(sessionId, url) {
    try {
        const recordingId = (0, uuid_1.v4)();
        const recording = await database_1.default.recording.create({
            data: {
                id: recordingId,
                sessionId,
                url,
                events: [],
            },
        });
        logger_1.logger.info(`Recording started: ${recordingId}`, { sessionId, url });
        return recordingId;
    }
    catch (error) {
        logger_1.logger.error("Failed to start recording", error);
        throw error;
    }
}
/**
 * Add event to recording
 */
async function addEventToRecording(recordingId, event) {
    try {
        const recording = await database_1.default.recording.findUnique({ where: { id: recordingId } });
        if (!recording) {
            throw new Error("Recording not found");
        }
        const events = recording.events || [];
        events.push(event);
        await database_1.default.recording.update({
            where: { id: recordingId },
            data: { events },
        });
        logger_1.logger.debug(`Event added to recording ${recordingId}`, event);
    }
    catch (error) {
        logger_1.logger.error("Failed to add event to recording", error);
    }
}
/**
 * Stop recording
 */
async function stopRecording(recordingId) {
    try {
        const recording = await database_1.default.recording.findUnique({ where: { id: recordingId } });
        if (!recording) {
            throw new Error("Recording not found");
        }
        const events = recording.events || [];
        logger_1.logger.info(`Recording stopped: ${recordingId}`, { totalEvents: events.length });
        return recording;
    }
    catch (error) {
        logger_1.logger.error("Failed to stop recording", error);
        throw error;
    }
}
/**
 * Get recording by ID
 */
async function getRecording(recordingId) {
    try {
        return await database_1.default.recording.findUnique({ where: { id: recordingId } });
    }
    catch (error) {
        logger_1.logger.error("Failed to get recording", error);
        throw error;
    }
}
/**
 * List all recordings
 */
async function listRecordings() {
    try {
        return await database_1.default.recording.findMany({ orderBy: { createdAt: "desc" } });
    }
    catch (error) {
        logger_1.logger.error("Failed to list recordings", error);
        return [];
    }
}
exports.default = {
    startRecording,
    addEventToRecording,
    stopRecording,
    getRecording,
    listRecordings,
};
//# sourceMappingURL=recorder.service.js.map