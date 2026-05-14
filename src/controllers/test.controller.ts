import { Request, Response } from "express";
import RunnerService from "../services/runner/runner.service";
import prisma from "../config/database";
import fs from "fs";
import path from "path";

import generatorService from "../services/generator/playwrightGenerator";

export async function runTest(req: Request, res: Response) {
  try {
    const { recordingId } = req.body;

    if (!recordingId)
      return res
        .status(400)
        .json({ success: false, message: "recordingId required" });

    const run = await RunnerService.runRecording(recordingId);

    return res.status(200).json({ success: true, data: run });
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "run failed" });
  }
}

export async function listRuns(_req: Request, res: Response) {
  const runs = await RunnerService.listRuns();

  return res.status(200).json({ success: true, data: runs });
}

export async function generateTest(req: Request, res: Response) {
  try {
    const { recordingId } = req.params;

    const recording = await prisma.recording.findUnique({
      where: {
        id: recordingId,
      },
    });

    if (!recording) {
      return res.status(404).json({
        success: false,
        message: "Recording not found",
      });
    }

    const events = JSON.parse(recording.events);

    const code = await generatorService.generatePlaywrightCode(
      events,
      `Recording-${recordingId}`,
    );

    const outputDir = path.resolve(process.cwd(), "generated-tests");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {
        recursive: true,
      });
    }

    const filePath = path.join(outputDir, `${recordingId}.spec.ts`);

    fs.writeFileSync(filePath, code);

    return res.status(200).json({
      success: true,
      filePath,
      code,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getRun(req: Request, res: Response) {
  const { id } = req.params;

  const run = await RunnerService.getRun(id);

  if (!run)
    return res.status(404).json({ success: false, message: "Run not found" });

  return res.status(200).json({ success: true, data: run });
}

export async function executeTest(req: Request, res: Response) {
  try {
    const { recordingId } = req.params;

    const result = await RunnerService.executeGeneratedTest(recordingId);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export default {
  runTest,
  listRuns,
  getRun,
  generateTest,
  executeTest,
};
