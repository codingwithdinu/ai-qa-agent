import { Router } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import recorderService from "../services/recorder/recorder.service";
import {authMiddleware} from "../middleware/auth.middleware";

import {
  createRecording,
  listRecordings,
  startRecording,
  stopRecording,
} from "../controllers/record.controller";

const router = Router();
const recorderCors = cors({
  origin: true,
  credentials: false,
});

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
 * Serve recorder injector script
 */
router.get(
  "/injector.js",
  recorderCors,
  (_req, res) => {
    try {
      const injectorPath = path.resolve(
        process.cwd(),
        "src",
        "services",
        "recorder",
        "injector.js",
      );
      const injectorScript = fs.readFileSync(
        injectorPath,
        "utf8",
      );

      res.setHeader(
        "Content-Type",
        "application/javascript"
      );
      res.setHeader(
        "Cache-Control",
        "no-store"
      );
      return res.send(
        injectorScript
      );
    } catch (error) {
      console.error(
        "Failed to load injector script",
        error
      );
      return res.status(500).json({
        success: false,
        message:
          "Injector not available",
      });
    }
  }
);

/**
 * Receive browser events
 */
router.options(
  "/event",
  recorderCors
);
router.post(
  "/event",
  recorderCors,
  async (req, res) => {
  try {
    const { recordingId, event } = req.body;

    if (!recordingId) {
      return res.status(400).json({
        success: false,
        message: "recordingId required",
      });
    }

    if (!event) {
      return res.status(400).json({
        success: false,
        message: "event required",
      });
    }

    await recorderService.addEventToRecording(recordingId, event);

    console.log("🎯 Event Saved:", event);

    return res.json({
      success: true,
    });
  } catch (error: any) {
    console.error(error);

    if (
      error?.message ===
      "Recording not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
    });
  }
});

export default router;
