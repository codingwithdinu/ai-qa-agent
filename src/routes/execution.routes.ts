import { Router } from "express";

import ExecutionController
  from "../controllers/execution.controller";

const router = Router();

/**
 * Get execution stats
 */
router.get(
  "/stats",
  ExecutionController.getExecutionStats
);

/**
 * Get failed executions
 */
router.get(
  "/failures",
  ExecutionController.getFailedExecutions
);

/**
 * Get all executions
 */
router.get(
  "/",
  ExecutionController.getAllExecutions
);

/**
 * Get execution by ID
 */
router.get(
  "/:id",
  ExecutionController.getExecutionById
);

export default router;