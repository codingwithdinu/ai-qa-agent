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
async function startRecording(sessionId, url, userId, workspaceId, options) {
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
                events: [],
            },
        });
        logger_1.logger.info(`Recording started: ${recordingId}`, {
            sessionId,
            url,
        });
        if (options?.launchBrowser === false) {
            logger_1.logger.info("Client recorder ready", {
                recordingId,
            });
            return recordingId;
        }
        /**
         * Launch Playwright Browser
         */
        const headless = process.env.PLAYWRIGHT_HEADLESS
            ? process.env.PLAYWRIGHT_HEADLESS !== "false"
            : process.env.NODE_ENV === "production";
        const launchOptions = {
            headless,
            args: headless
                ? ["--no-sandbox", "--disable-dev-shm-usage"]
                : ["--new-window", "--start-maximized"],
        };
        const channel = process.env.PLAYWRIGHT_CHANNEL;
        if (channel) {
            launchOptions.channel = channel;
        }
        browser = await playwright_1.chromium.launch(launchOptions);
        const context = await browser.newContext({
            viewport: headless ? { width: 1366, height: 768 } : null,
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
        if (recording.url && event?.url) {
            try {
                const recordingOrigin = new URL(recording.url).origin;
                const eventOrigin = new URL(event.url).origin;
                if (recordingOrigin !== eventOrigin) {
                    logger_1.logger.info("Skipping event from different origin", {
                        recordingId,
                        recordingOrigin,
                        eventOrigin,
                    });
                    return;
                }
            }
            catch (error) {
                logger_1.logger.warn("Failed to compare event origin", {
                    recordingId,
                    error: error?.message || error,
                });
            }
        }
        if (event?.type === "click" && event.selector) {
            const selector = event.selector.trim();
            const rawText = typeof event.text === "string"
                ? event.text
                : "";
            const text = rawText.replace(/\s+/g, " ").trim();
            if (text && selector === "a") {
                event.selector =
                    `role=link[name="${text.replace(/"/g, '\\"')}"]`;
            }
            else if (text && selector === "button") {
                event.selector =
                    `role=button[name="${text.replace(/"/g, '\\"')}"]`;
            }
        }
        const events = Array.isArray(recording.events)
            ? [...recording.events]
            : [];
        events.push(event);
        await database_1.default.recording.update({
            where: { id: recordingId },
            data: { events },
        });
        logger_1.logger.debug(`Event added to recording ${recordingId}`, event);
    }
    catch (error) {
        logger_1.logger.error("Failed to add event to recording", error);
        throw error;
    }
}
/**
 * Stop recording
 */
async function stopRecording(recordingId) {
    try {
        const targetRecordingId = recordingId || currentRecordingId;
        if (!targetRecordingId) {
            throw new Error("Recording not found");
        }
        const recording = await database_1.default.recording.findUnique({
            where: {
                id: targetRecordingId
            },
        });
        if (!recording) {
            throw new Error("Recording not found");
        }
        const events = Array.isArray(recording.events)
            ? recording.events
            : [];
        logger_1.logger.info(`Recording stopped: ${targetRecordingId}`, {
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
            events: recording.events || [],
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