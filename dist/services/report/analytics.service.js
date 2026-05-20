"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnalytics = generateAnalytics;
const logger_1 = require("../../utils/logger");
const database_1 = __importDefault(require("../../config/database"));
/**
 * Generate analytics from test runs
 */
async function generateAnalytics(recordingId) {
    try {
        const testRuns = await database_1.default.testRun.findMany({
            where: { recordingId },
        });
        const parsedRuns = testRuns.map((run) => ({
            ...run,
            steps: JSON.parse(run.steps || "[]"),
        }));
        const totalRuns = parsedRuns.length;
        const passedRuns = parsedRuns.filter((r) => r.success).length;
        const failedRuns = totalRuns - passedRuns;
        const totalSteps = parsedRuns.reduce((sum, run) => sum + run.steps.length, 0);
        const passedSteps = parsedRuns.reduce((sum, run) => {
            const passed = run.steps.filter((s) => s.success).length;
            return sum + passed;
        }, 0);
        const avgDuration = parsedRuns.reduce((sum, run) => {
            const start = new Date(run.startedAt).getTime();
            const end = new Date(run.finishedAt || new Date()).getTime();
            return sum + (end - start);
        }, 0) / (totalRuns || 1);
        const analytics = {
            totalRuns,
            passedRuns,
            failedRuns,
            successRate: ((passedRuns / totalRuns) * 100).toFixed(2),
            totalSteps,
            passedSteps,
            failedSteps: totalSteps - passedSteps,
            stepSuccessRate: ((passedSteps / totalSteps) * 100).toFixed(2),
            avgDuration: Math.round(avgDuration),
            lastRun: parsedRuns[0]?.startedAt,
        };
        logger_1.logger.info(`Generated analytics for recording ${recordingId}`, analytics);
        return analytics;
    }
    catch (error) {
        logger_1.logger.error("Analytics generation error", error);
        throw error;
    }
}
exports.default = { generateAnalytics };
//# sourceMappingURL=analytics.service.js.map