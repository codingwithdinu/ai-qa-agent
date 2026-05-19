import { Router } from "express";
import recorderService from "../services/recorder/recorder.service";
import {authMiddleware} from "../middleware/auth.middleware";

import {
  createRecording,
  listRecordings,
  startRecording,
  stopRecording,
} from "../controllers/record.controller";

const router = Router();

/**
 * Save recording events
 */
router.post("/", createRecording);

/**
 * List recordings
 */
router.get(
  "/",
  authMiddleware,
  listRecordings
);

/**
 * Start Playwright recording browser
 */
router.post(
  "/start",
  authMiddleware,
  startRecording
);

/**
 * Stop recording
 */
router.post(
  "/stop",
  authMiddleware,
  stopRecording
);

/**
 * Receive browser events
 */
router.post("/event", async (req, res) => {
  try {
    const { recordingId, event } = req.body;

    await recorderService.addEventToRecording(recordingId, event);

    console.log("🎯 Event Saved:", event);

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
    });
  }
});

export default router;
