"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummaryReport = generateSummaryReport;
const logger_1 = require("../../utils/logger");
const database_1 = __importDefault(require("../../config/database"));
/**
 * Generate summary report for multiple test runs
 */
async function generateSummaryReport(recordingId) {
    try {
        const testRuns = await database_1.default.testRun.findMany({
            where: { recordingId },
            orderBy: { startedAt: "desc" },
        });
        const totalRuns = testRuns.length;
        const passedRuns = testRuns.filter((r) => r.success).length;
        const failedRuns = totalRuns - passedRuns;
        let summary = `# Recording Test Summary

**Recording ID:** ${recordingId}
**Total Test Runs:** ${totalRuns}
**Passed Runs:** ${passedRuns}
**Failed Runs:** ${failedRuns}
**Success Rate:** ${totalRuns > 0 ? ((passedRuns / totalRuns) * 100).toFixed(2) : 0}%

## Recent Test Runs

`;
        testRuns.slice(0, 10).forEach((run, index) => {
            const status = run.success ? "✅ PASSED" : "❌ FAILED";
            const startTime = new Date(run.startedAt).toLocaleString();
            const duration = run.finishedAt ? new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime() : 0;
            summary += `${index + 1}. ${status} - ${startTime} (${duration}ms)\n`;
        });
        logger_1.logger.info(`Generated summary report for recording ${recordingId}`);
        return summary;
    }
    catch (error) {
        logger_1.logger.error("Summary report generation error", error);
        throw error;
    }
}
exports.default = { generateSummaryReport };
//# sourceMappingURL=summary.service.js.map