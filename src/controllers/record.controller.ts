import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import prisma from "../config/database";
import { Recording } from "@prisma/client";
import recorderService from "../services/recorder/recorder.service";
import { io } from "../server";
interface AuthRequest
  extends Request {
  userId?: string;
}

export async function createRecording(req: AuthRequest, res: Response) {
  const { events, sessionId, workspaceId, } = req.body;

  if (!events || !Array.isArray(events))
    return res
      .status(400)
      .json({ success: false, message: "events array required" });

  if (!workspaceId) {
    return res.status(400).json({
      success: false,
      message: "Workspace required",
    });
  }

  // persist to database
  const created =
    await prisma.recording.create({
      data: {
        id: uuid(),
        sessionId:
          sessionId || null,
        events:
          JSON.stringify(events),
        userId:
          req.userId!,
        workspaceId:
          req.body.workspaceId,
      },
    });

  io.emit("dashboard-updated");



  return res.status(201).json({
    success: true,
    data: {
      ...created,
      events: JSON.parse(created.events),
    },
  });



}

export async function listRecordings(req: AuthRequest, res: Response) {

  console.log("USER ID:", req.userId);

  const recs =
    await prisma.recording.findMany({
      where: {
        userId:
          req.userId!,
      },
      orderBy: {
        createdAt:
          "desc",
      },
    });

  console.log("RECORDINGS:", recs);

  return res.status(200).json({
    success: true,
    data: recs.map((recording: Recording) => ({
      ...recording,
      events: JSON.parse(recording.events),
    })),
  });
}

export async function startRecording(req: AuthRequest, res: Response) {
  try {
    const {
      sessionId,
      url,
      workspaceId
    } = req.body;





    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "Workspace required",
      });
    }

    const membership =
      await prisma.workspaceMember.findFirst({

        where: {
          workspaceId,
          userId: req.userId!,
        },
      });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized workspace",
      });
    }

    const recordingId =
      await recorderService.startRecording(
        sessionId,
        url,
        req.userId!,
        workspaceId
      );

    io.emit("dashboard-updated");


    return res.status(200).json({
      success: true,
      recordingId,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function stopRecording(req: AuthRequest, res: Response) {

  try {

    const recordingId =
      req.body.recordingId;

    const recording =
      await recorderService.stopRecording(
        recordingId
      );

    io.emit("dashboard-updated");
    /**
     * Auto generate + execute test
     * in background
     */
    setTimeout(async () => {

      try {

        console.log(
          "🤖 Background AI generation started"
        );

        const baseUrl =
          process.env.API_BASE_URL ||
          "http://localhost:5000";

        await fetch(
          `${baseUrl}/api/test/generate/${recording.id}`,
          {
            method: "POST",
          }
        );

        await fetch(
          `${baseUrl}/api/test/execute/${recording.id}`,
          {
            method: "POST",
          }
        );

        console.log(
          "✅ Background AI generation completed"
        );

      } catch (error) {

        console.error(
          "❌ Background generation failed",
          error
        );

      }

    }, 100);

    return res.json({

      success: true,

      recordingId:
        recording.id,

      data:
        recording,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to stop recording",
    });
  }
}

export default {
  createRecording,
  listRecordings,
  startRecording,
  stopRecording,
};
