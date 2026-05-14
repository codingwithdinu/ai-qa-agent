import { Router } from "express";

import recordRoutes
  from "./record.routes";

import testRoutes
  from "./test.routes";

import executionRoutes
  from "./execution.routes";

const router = Router();

/**
 * Recording APIs
 */
router.use(
  "/record",
  recordRoutes
);

/**
 * Test APIs
 */
router.use(
  "/test",
  testRoutes
);

/**
 * Execution Analytics APIs
 */
router.use(
  "/executions",
  executionRoutes
);

export default router;