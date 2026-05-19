import { Router } from "express";
import prisma from "../config/database";

const router = Router();

router.post("/github", async (req, res) => {
  try {

    const payload = req.body;

    const workflowRun = payload.workflow_run;

    if (!workflowRun) {
      return res.status(400).json({
        success: false,
        message: "No workflow_run payload",
      });
    }

    const recording = await prisma.recording.findFirst();

    if (!recording) {
      return res.status(404).json({
        success: false,
        message: "No recording found",
      });
    }

    await prisma.testExecution.create({
      data: {

        recordingId: "10f84b30-5376-11f1-9f4f-493e473e5276",

        status:
          workflowRun.conclusion === "success"
            ? "PASSED"
            : "FAILED",

        healedCount: 0,

        duration:
          workflowRun.run_started_at &&
          workflowRun.updated_at
            ? (
                new Date(workflowRun.updated_at).getTime() -
                new Date(workflowRun.run_started_at).getTime()
              ) / 1000
            : 0,

        logs: JSON.stringify(payload),

        provider: "GitHub Actions",

        branch:
          workflowRun.head_branch || "main",

        environment: "production",

        repository:
          payload.repository?.full_name || "",

        workflowName:
          workflowRun.name || "",

        actor:
          workflowRun.actor?.login || "",

        commitMessage:
          workflowRun.head_commit?.message || "",
      },
    });

    console.log("✅ GitHub webhook saved");

    res.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
});

export default router;