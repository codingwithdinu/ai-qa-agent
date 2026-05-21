"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExecutions = getAllExecutions;
exports.getExecutionById = getExecutionById;
exports.getFailedExecutions = getFailedExecutions;
exports.getExecutionStats = getExecutionStats;
const database_1 = __importDefault(require("../../config/database"));
/**
 * Get all test executions
 */
async function getAllExecutions(userId) {
    return await database_1.default.testExecution.findMany({
        where: {
            recording: {
                userId: userId,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
/**
 * Get execution by ID
 */
async function getExecutionById(id, userId) {
    return await database_1.default.testExecution.findFirst({
        where: {
            id,
            recording: {
                userId: userId,
            },
        },
    });
}
/**
 * Get failed executions
 */
async function getFailedExecutions(userId) {
    return await database_1.default.testExecution.findMany({
        where: {
            status: "FAILED",
            recording: {
                userId: userId,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
/**
 * Get execution analytics stats
 */
async function getExecutionStats(userId) {
    const executions = await database_1.default.testExecution.findMany({
        where: {
            recording: {
                userId: userId,
            },
        },
    });
    const totalTests = executions.length;
    const passedTests = executions.filter((e) => e.status === "PASSED").length;
    const failedTests = executions.filter((e) => e.status === "FAILED").length;
    const totalHealing = executions.reduce((acc, curr) => acc + curr.healedCount, 0);
    const avgDuration = totalTests > 0
        ? executions.reduce((acc, curr) => acc + curr.duration, 0) / totalTests
        : 0;
    const healingSuccessRate = totalTests > 0
        ? Number(((passedTests / totalTests) *
            100).toFixed(2))
        : 0;
    const recentFailures = executions
        .filter((e) => e.status === "FAILED")
        .slice(0, 5);
    return {
        totalTests,
        passedTests,
        failedTests,
        totalHealing,
        avgDuration: Number(avgDuration.toFixed(2)),
        healingSuccessRate,
        recentFailures,
        executionTrend: executions.map((e) => ({
            id: e.id,
            status: e.status,
            duration: e.duration,
            createdAt: e.createdAt,
        })),
    };
}
exports.default = {
    getAllExecutions,
    getExecutionById,
    getFailedExecutions,
    getExecutionStats,
};
//# sourceMappingURL=execution.service.js.map