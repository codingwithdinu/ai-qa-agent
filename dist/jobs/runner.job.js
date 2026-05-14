"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScheduledTests = runScheduledTests;
const logger_1 = require("../utils/logger");
const database_1 = __importDefault(require("../config/database"));
const runner_service_1 = require("../services/runner/runner.service");
/**
 * Periodically run tests for all recordings
 */
async function runScheduledTests() {
    try {
        logger_1.logger.info("Starting scheduled test run job");
        const recordings = await database_1.default.recording.findMany();
        for (const recording of recordings) {
            try {
                logger_1.logger.info(`Running test for recording ${recording.id}`);
                await (0, runner_service_1.runRecording)(recording.id);
            }
            catch (error) {
                logger_1.logger.error(`Failed to run test for recording ${recording.id}`, error);
            }
        }
        logger_1.logger.info("Scheduled test run job completed");
    }
    catch (error) {
        logger_1.logger.error("Scheduled test run job error", error);
    }
}
exports.default = { runScheduledTests };
//# sourceMappingURL=runner.job.js.map