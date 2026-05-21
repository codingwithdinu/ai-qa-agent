"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = getAnalytics;
const database_1 = __importDefault(require("../config/database"));
async function getAnalytics(req, res) {
    try {
        const executions = await database_1.default.testExecution.findMany({
            where: {
                recording: {
                    userId: req.userId,
                },
            },
        });
        const totalTests = executions.length;
        const passedTests = executions.filter((e) => e.status === "PASSED").length;
        const failedTests = executions.filter((e) => e.status === "FAILED").length;
        const avgDuration = totalTests > 0
            ? executions.reduce((acc, curr) => acc + curr.duration, 0) / totalTests
            : 0;
        const healedTests = executions.reduce((acc, curr) => acc + curr.healedCount, 0);
        return res.json({
            success: true,
            data: {
                totalTests,
                passedTests,
                failedTests,
                healedTests,
                avgDuration: Number(avgDuration.toFixed(2)),
                releaseConfidence: totalTests > 0
                    ? Math.round((passedTests / totalTests) * 100)
                    : 0,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
exports.default = {
    getAnalytics,
};
//# sourceMappingURL=analytics.controller.js.map