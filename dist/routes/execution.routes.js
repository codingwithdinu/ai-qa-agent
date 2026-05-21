"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const execution_controller_1 = __importDefault(require("../controllers/execution.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * Get execution stats
 */
router.get("/stats", auth_middleware_1.authMiddleware, execution_controller_1.default.getExecutionStats);
/**
 * Get failed executions
 */
router.get("/failures", auth_middleware_1.authMiddleware, execution_controller_1.default.getFailedExecutions);
/**
 * Get all executions
 */
router.get("/", auth_middleware_1.authMiddleware, execution_controller_1.default.getAllExecutions);
/**
 * Get execution by ID
 */
router.get("/:id", auth_middleware_1.authMiddleware, execution_controller_1.default.getExecutionById);
exports.default = router;
//# sourceMappingURL=execution.routes.js.map