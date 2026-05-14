"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRecording = runRecording;
exports.listRuns = listRuns;
exports.getRun = getRun;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../../config/database"));
const playwright_1 = require("playwright");
async function runRecording(recordingId) {
    const rec = await database_1.default.recording.findUnique({ where: { id: recordingId } });
    if (!rec)
        throw new Error("Recording not found");
    const runId = (0, uuid_1.v4)();
    const startedAt = new Date();
    const browser = await playwright_1.chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    const steps = [];
    let success = true;
    try {
        const events = rec.events;
        for (let i = 0; i < events.length; i++) {
            const ev = events[i];
            try {
                if (ev.type === "navigate" && ev.url) {
                    await page.goto(ev.url, { waitUntil: "load" });
                }
                else if (ev.type === "click" && ev.selector) {
                    await page.click(ev.selector);
                }
                else if (ev.type === "type" && ev.selector) {
                    if (ev.text !== undefined) {
                        await page.fill(ev.selector, ev.text);
                    }
                }
                else if (ev.type === "wait" && ev.ms) {
                    await page.waitForTimeout(ev.ms);
                }
                else {
                    // unknown action - no-op
                }
                steps.push({ index: i + 1, action: ev.type || "unknown", success: true });
            }
            catch (stepErr) {
                success = false;
                steps.push({ index: i + 1, action: ev.type || "unknown", success: false, error: String(stepErr) });
            }
        }
    }
    finally {
        await browser.close();
    }
    const finishedAt = new Date();
    const created = await database_1.default.testRun.create({
        data: {
            id: runId,
            recordingId,
            startedAt,
            finishedAt,
            success,
            steps: steps,
        },
    });
    return created;
}
async function listRuns() {
    return database_1.default.testRun.findMany({ orderBy: { startedAt: 'desc' } });
}
async function getRun(id) {
    return database_1.default.testRun.findUnique({ where: { id } });
}
exports.default = { runRecording, listRuns, getRun };
//# sourceMappingURL=runner.service.js.map