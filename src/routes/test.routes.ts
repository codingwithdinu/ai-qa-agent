import { Router } from "express";
import TestController from "../controllers/test.controller";

const router = Router();

/**
 * Run generated test
 */
router.post("/run", TestController.runTest);

/**
 * Generate Playwright test from recording
 */
router.post(
  "/generate/:recordingId",
  TestController.generateTest
);

/**
 * Execute generated Playwright test
 */
router.post(
  "/execute/:recordingId",
  TestController.executeTest
);

/**
 * List all runs
 */
router.get("/", TestController.listRuns);

/**
 * Get single run
 */
router.get("/:id", TestController.getRun);

export default router;