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
exports.generateDailyReports = generateDailyReports;
const logger_1 = require("../utils/logger");
const database_1 = __importDefault(require("../config/database"));
const summary_service_1 = require("../services/report/summary.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Generate daily reports for all recordings
 */
async function generateDailyReports() {
    try {
        logger_1.logger.info("Starting daily report generation job");
        const recordings = await database_1.default.recording.findMany();
        for (const recording of recordings) {
            try {
                const summary = await (0, summary_service_1.generateSummaryReport)(recording.id);
                const reportDir = "./reports";
                if (!fs.existsSync(reportDir)) {
                    fs.mkdirSync(reportDir, { recursive: true });
                }
                const reportFile = path.join(reportDir, `report-${recording.id}-${Date.now()}.md`);
                fs.writeFileSync(reportFile, summary);
                logger_1.logger.info(`Generated report for recording ${recording.id}`);
            }
            catch (error) {
                logger_1.logger.error(`Failed to generate report for recording ${recording.id}`, error);
            }
        }
        logger_1.logger.info("Daily report generation job completed");
    }
    catch (error) {
        logger_1.logger.error("Daily report job error", error);
    }
}
exports.default = { generateDailyReports };
//# sourceMappingURL=report.job.js.map