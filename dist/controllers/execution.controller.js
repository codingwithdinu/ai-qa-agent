"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExecutions = getAllExecutions;
exports.getExecutionById = getExecutionById;
exports.getFailedExecutions = getFailedExecutions;
exports.getExecutionStats = getExecutionStats;
const execution_service_1 = __importDefault(require("../services/execution/execution.service"));
/**
 * Get all executions
 */
async function getAllExecutions(req, res) {
    try {
        const executions = await execution_service_1.default.getAllExecutions(req.userId);
        return res.status(200).json({
            success: true,
            data: executions,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
/**
 * Get execution by ID
 */
async function getExecutionById(req, res) {
    try {
        const { id } = req.params;
        const execution = await execution_service_1.default.getExecutionById(id, req.userId);
        if (!execution) {
            return res.status(404).json({
                success: false,
                message: "Execution not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: execution,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
/**
 * Get failed executions
 */
async function getFailedExecutions(req, res) {
    try {
        const failedExecutions = await execution_service_1.default.getFailedExecutions(req.userId);
        return res.status(200).json({
            success: true,
            data: failedExecutions,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
/**
 * Get execution statistics
 */
async function getExecutionStats(req, res) {
    try {
        const stats = await execution_service_1.default.getExecutionStats(req.userId);
        return res.status(200).json({
            success: true,
            data: stats,
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
    getAllExecutions,
    getExecutionById,
    getFailedExecutions,
    getExecutionStats,
};
//# sourceMappingURL=execution.controller.js.map