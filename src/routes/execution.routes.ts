import { Router } from "express";

import ExecutionController
  from "../controllers/execution.controller";

import {
  authMiddleware
} from "../middleware/auth.middleware";

const router = Router();

/**
 * Get execution stats
 */
router.get(
  "/stats",
  authMiddleware,
  ExecutionController.getExecutionStats
);

/**
 * Get failed executions
 */
router.get(
  "/failures",
  authMiddleware,
  ExecutionController.getFailedExecutions
);

/**
 * Get all executions
 */
router.get(
  "/",
  authMiddleware,
  ExecutionController.getAllExecutions
);

/**
 * Get execution by ID
 */
router.get(
  "/:id",
  authMiddleware,
  ExecutionController.getExecutionById
);

export default router;