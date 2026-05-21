import { Router } from "express";
import prisma from "../config/database";
import { generatePlaywrightCode } from "../services/generator/playwrightGenerator";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { RecordingEvent } from "../types/recording.types";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {

    const latestRecording =
      await prisma.recording.findFirst({

        where: {

          userId:
            req.userId,

        },

        orderBy: {

          createdAt:
            "desc",

        },

      });

    const recordingSteps = [];

    if (latestRecording) {

      try {

        const events =
          (
            Array.isArray(latestRecording.events)
              ? latestRecording.events
              : []
          ) as unknown as RecordingEvent[];

        recordingSteps.push(

          ...events.map(
            (
              event: any,
              index: number
            ) => ({

              id:
                `${latestRecording.id}-${index}`,

              action:
                event.type || "Unknown",

              selector:
                event.selector ||
                event.url ||
                "No selector",

              value:
                event.text || "",

              timestamp:
                event.timestamp || null,

              duration:
                `${index + 1}s`,

              status:
                event.selector
                  ?.includes("role=")
                  ? "optimized"
                  : "healed",

            })
          )

        );

      } catch {

        console.log(
          "Failed to parse events"
        );

      }

    }

    res.json({

      success: true,

      data: {

        recordingSteps,

        generatedScript:
          latestRecording

            ? await generatePlaywrightCode(

              (
                Array.isArray(
                  latestRecording.events
                )
                  ? latestRecording.events
                  : []
              ) as unknown as RecordingEvent[],
              latestRecording.id
            )

            : "// No script generated"
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        "Recording fetch failed",
    });
  }
});

export default router;