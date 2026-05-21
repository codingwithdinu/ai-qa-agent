"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRecording = runRecording;
exports.listRuns = listRuns;
exports.getRun = getRun;
exports.executeGeneratedTest = executeGeneratedTest;
const child_process_1 = require("child_process");
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
        const events = (Array.isArray(rec.events)
            ? rec.events
            : []);
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
                steps.push({
                    index: i + 1,
                    action: ev.type || "unknown",
                    success: true,
                });
            }
            catch (stepErr) {
                success = false;
                steps.push({
                    index: i + 1,
                    action: ev.type || "unknown",
                    success: false,
                    error: String(stepErr),
                });
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
            steps: JSON.stringify(steps),
        },
    });
    return { ...created, steps };
}
async function listRuns() {
    const runs = await database_1.default.testRun.findMany({
        orderBy: { startedAt: "desc" },
    });
    return runs.map((run) => ({
        ...run,
        steps: JSON.parse(run.steps || "[]"),
    }));
}
async function getRun(id) {
    const run = await database_1.default.testRun.findUnique({ where: { id } });
    if (!run)
        return null;
    return { ...run, steps: JSON.parse(run.steps || "[]") };
}
async function executeGeneratedTest(recordingId) {
    return new Promise(async (resolve, reject) => {
        const startedAt = Date.now();
        try {
            const outputDir = `test-results/${recordingId}`;
            const command = `npx playwright test generated-tests/${recordingId}.spec.ts --output=${outputDir}`;
            const provider = process.env.CI_PROVIDER ||
                "Local Runner";
            const branch = process.env.GIT_BRANCH ||
                "main";
            const environment = process.env.NODE_ENV ||
                "development";
            const commitHash = process.env.GIT_COMMIT ||
                "local";
            const buildNumber = process.env.BUILD_NUMBER ||
                Date.now().toString();
            console.log("🚀 Running Test:");
            console.log(command);
            (0, child_process_1.exec)(command, {
                env: {
                    ...process.env,
                    PLAYWRIGHT_BROWSERS_PATH: "0",
                },
            }, async (error, stdout, stderr) => {
                console.log("========== STDOUT ==========");
                console.log(stdout);
                console.log("========== STDERR ==========");
                console.log(stderr);
                const endedAt = Date.now();
                const duration = (endedAt - startedAt) / 1000;
                const healedCount = (stdout.match(/AI healed selector/g) || []).length +
                    (stdout.match(/AI healed assertion/g) || []).length;
                const success = !error;
                await database_1.default.testExecution.create({
                    data: {
                        recordingId,
                        status: success
                            ? "PASSED"
                            : "FAILED",
                        healedCount,
                        duration,
                        provider,
                        branch,
                        environment,
                        commitHash,
                        buildNumber,
                        logs: stdout + "\n" + stderr,
                    },
                });
                if (error) {
                    console.log("EXEC ERROR:");
                    console.log(error);
                    console.log("STDERR:");
                    console.log(stderr);
                    console.log("STDOUT:");
                    console.log(stdout);
                    return reject({
                        success: false,
                        message: stderr ||
                            stdout ||
                            error.message,
                    });
                }
                resolve({
                    success: true,
                    output: stdout,
                    healedCount,
                    duration,
                });
            });
        }
        catch (error) {
            reject({
                success: false,
                message: error.message,
            });
        }
    });
}
exports.default = {
    runRecording,
    listRuns,
    getRun,
    executeGeneratedTest,
};
//# sourceMappingURL=runner.service.js.map