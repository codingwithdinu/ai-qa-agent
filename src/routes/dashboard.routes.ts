import { Router } from "express";
import prisma from "../config/database";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { formatRecordingEvents } from "../utils/recordingFormatter";


const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {


  const recordings =
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

  const allEvents =
    recordings.flatMap((r) => {
      try {
        return JSON.parse(
          r.events || "[]"
        );

      } catch {
        return [];
      }
    });

  const recordingSteps =
    formatRecordingEvents(
      allEvents
    );

  const totalRuns =
    await prisma.testRun.count({
      where: {
        recording: {
          userId:
            req.userId!,
        },
      },
    });

  const totalRecordings =
    await prisma.recording.count({
      where: {
        userId:
          req.userId!,
      },
    });

  res.json({

    success: true,

    data: {
      releaseConfidence: 92,
      aiActions: 128,
      repairTime: 4,
      pipelineCoverage: totalRuns,
      recordings: totalRecordings,
      recordingSteps,
    },
  });
});

export default router;