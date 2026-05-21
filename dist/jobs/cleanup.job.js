"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupOldData = cleanupOldData;
const logger_1 = require("../utils/logger");
const database_1 = __importDefault(require("../config/database"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Cleanup old recordings and test data
 */
async function cleanupOldData() {
    try {
        logger_1.logger.info("Starting cleanup job");
        const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        // Delete old recordings
        const deletedRecordings = await database_1.default.recording.deleteMany({
            where: {
                createdAt: {
                    lt: THIRTY_DAYS_AGO,
                },
            },
        });
        logger_1.logger.info(`Deleted ${deletedRecordings.count} old recordings`);
        // Delete old test runs
        const deletedTestRuns = await database_1.default.testRun.deleteMany({
            where: {
                startedAt: {
                    lt: THIRTY_DAYS_AGO,
                },
            },
        });
        logger_1.logger.info(`Deleted ${deletedTestRuns.count} old test runs`);
        // Cleanup local files
        await cleanupLocalFiles();
        logger_1.logger.info("Cleanup job completed successfully");
    }
    catch (error) {
        logger_1.logger.error("Cleanup job error", error);
    }
}
async function cleanupLocalFiles() {
    const dirs = ["./screenshots", "./recordings", "./reports"];
    for (const dir of dirs) {
        if (!fs.existsSync(dir))
            continue;
        const files = fs.readdirSync(dir);
        const THIRTY_DAYS_AGO = Date.now() - 30 * 24 * 60 * 60 * 1000;
        for (const file of files) {
            const filepath = path.join(dir, file);
            const stat = fs.statSync(filepath);
            if (stat.mtimeMs < THIRTY_DAYS_AGO) {
                fs.unlinkSync(filepath);
                logger_1.logger.debug(`Deleted old file: ${filepath}`);
            }
        }
    }
}
exports.default = { cleanupOldData };
//# sourceMappingURL=cleanup.job.js.map