import { Router } from "express";
import prisma from "../config/database";
import {
  authMiddleware,
  AuthRequest,
} from "../middleware/auth.middleware";

import {
  getWorkflowRuns,
} from "../services/github/github.service";

const router = Router();

router.get(
  "/",
  authMiddleware,
  async (
    req: AuthRequest,
    res
  ) => {

    try {

      /**
       * LOCAL EXECUTIONS
       */
      const executions =
        await prisma.testExecution.findMany({
          where: {
            recording: {
              userId:
                req.userId!,
            },
          },
          orderBy: {
            createdAt:
              "desc",
          },
        });

      /**
       * REAL GITHUB ACTIONS
       */
      const workflowRuns =
        await getWorkflowRuns();

      /**
       * GITHUB PIPELINES
       */
      const githubPipelines =
        workflowRuns.map((run: any) => ({

          id: run.id.toString(),

          provider:
            "GitHub Actions",

          branch:
            run.head_branch ||
            "main",

          environment:
            run.head_branch === "main"
              ? "production"
              : "staging",

          status:
            run.status ===
              "in_progress"
              ? "Running"
              : run.conclusion ===
                "success"
                ? "Passing"
                : run.conclusion ===
                  "failure"
                  ? "Failed"
                  : "Queued",

          duration:
            run.run_started_at
              ? `${Math.round(
                (
                  new Date(
                    run.updated_at
                  ).getTime() -
                  new Date(
                    run.run_started_at
                  ).getTime()
                ) / 1000
              )}s`
              : "0s",

          qaGate:
            run.conclusion ===
              "failure"
              ? "Blocked"
              : "Passed",

          health:
            run.conclusion ===
              "failure"
              ? "critical"
              : "healthy",

        }));

      /**
       * LOCAL EXECUTIONS
       */
      const localPipelines =
        executions.map((e) => ({

          id: e.id,

          provider:
            "Local Runner",

          branch:
            "main",

          environment:
            "development",

          status:
            e.status === "PASSED"
              ? "Passing"
              : e.status ===
                "FAILED"
                ? "Failed"
                : "Running",

          duration:
            `${e.duration || 0}s`,

          qaGate:
            e.status ===
              "FAILED"
              ? "Blocked"
              : e.healedCount > 0
                ? "AI Healed"
                : "Passed",

          health:
            e.status ===
              "FAILED"
              ? "critical"
              : e.healedCount > 0
                ? "warning"
                : "healthy",

        }));

      /**
       * MERGED PIPELINES
       */
      const pipelineItems = [

        ...githubPipelines,

        ...localPipelines,

      ];

      /**
       * TIMELINE
       */
      const deploymentTimeline =
        workflowRuns.map(
          (run: any) => ({

            id:
              run.id.toString(),

            stage:
              run.conclusion ===
                "success"
                ? "Deployment Complete"
                : run.conclusion ===
                  "failure"
                  ? "Deployment Failed"
                  : "Deployment Running",

            status:
              run.conclusion ===
                "success"
                ? "complete"
                : "active",

            detail:
              `${run.name} • ${run.head_branch}`,

          })
        );

      res.json({

        success: true,

        data: {

          pipelineItems,

          deploymentTimeline,

        },
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Pipeline analytics failed",
      });
    }
  }
);

export default router;