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
const playwright_1 = require("playwright");
const path_1 = __importDefault(require("path"));
let browser = null;
let page = null;
let currentRecordingId = "";
/**
 * Start recording browser session
 */
async function startRecording(sessionId, url, userId, workspaceId) {
    try {
        const recordingId = (0, uuid_1.v4)();
        currentRecordingId = recordingId;
        const recording = await database_1.default.recording.create({
            data: {
                id: recordingId,
                sessionId,
                url,
                userId,
                workspaceId,
                events: JSON.stringify([]),
            },
        });
        logger_1.logger.info(`Recording started: ${recordingId}`, {
            sessionId,
            url,
        });
        /**
         * Launch Playwright Browser
         */
        browser = await playwright_1.chromium.launch({
            headless: false,
            channel: "chrome",
            args: [
                "--new-window",
                "--start-maximized",
            ],
        });
        const context = await browser.newContext({
            viewport: null,
        });
        /**
         * Injector path
         */
        const injectorPath = path_1.default.resolve(process.cwd(), "src", "services", "recorder", "injector.js");
        console.log("Injector Path:", injectorPath);
        /**
         * Create page
         */
        page = await context.newPage();
        await page.bringToFront();
        /**
         * Bridge frontend injector
         * to backend recorder
         */
        await page.exposeFunction("sendRecordedEvent", async (payload) => {
            await addEventToRecording(recordingId, payload);
            console.log("🎯 Event Saved:", payload);
        });
        /**
         * Open target URL
         */
        await page.goto(url, {
            waitUntil: "load",
            timeout: 60000,
        });
        await page.bringToFront();
        /**
         * Inject recorder script
         */
        await page.addScriptTag({
            path: injectorPath,
        });
        /**
         * VERIFY INJECTOR
         */
        console.log("✅ Recorder injected");
        logger_1.logger.info("🎥 Playwright browser launched");
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
        const recording = await database_1.default.recording.findUnique({
            where: { id: recordingId },
        });
        if (!recording) {
            throw new Error("Recording not found");
        }
        const events = JSON.parse(recording.events || "[]");
        events.push(event);
        await database_1.default.recording.update({
            where: { id: recordingId },
            data: { events: JSON.stringify(events) },
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
        const recording = await database_1.default.recording.findUnique({
            where: {
                id: currentRecordingId
            },
        });
        if (!recording) {
            throw new Error("Recording not found");
        }
        const events = JSON.parse(recording.events || "[]");
        logger_1.logger.info(`Recording stopped: ${currentRecordingId}`, {
            totalEvents: events.length,
        });
        /**
         * Close browser
         */
        if (browser) {
            currentRecordingId = "";
            await browser.close();
            browser = null;
            page = null;
        }
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
        const recordings = await database_1.default.recording.findMany({
            orderBy: { createdAt: "desc" },
        });
        return recordings.map((recording) => ({
            ...recording,
            events: JSON.parse(recording.events || "[]"),
        }));
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