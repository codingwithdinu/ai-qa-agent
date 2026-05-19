import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../config/database";

export async function getReports(
  req: AuthRequest,
  res: Response
) {

  try {

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

    const totalExecutions =
      executions.length;

    const passedExecutions =
      executions.filter(
        (e) => e.status === "PASSED"
      ).length;

    const failedExecutions =
      executions.filter(
        (e) => e.status === "FAILED"
      ).length;

    const totalHealing =
      executions.reduce(
        (sum, e) =>
          sum + e.healedCount,
        0
      );

    const avgDuration =
      totalExecutions > 0
        ? executions.reduce(
          (sum, e) =>
            sum + e.duration,
          0
        ) / totalExecutions
        : 0;

    const reportInsights = executions.map((execution, index) => ({

      id: execution.id,

      title:
        `Recording-${execution.recordingId.slice(0, 8)}`,

      description:
        execution.status === "PASSED"
          ? "Execution completed successfully."
          : "Execution failed during runtime.",

      metric:
        `${execution.duration.toFixed(2)}s`,

      status:
        execution.status,

      healed:
        execution.healedCount,

    }));





    const compatibilityData =
      executions.map((execution, index) => ({

        browser:
          `Run ${index + 1}`,

        chrome:
          execution.status === "PASSED"
            ? 1
            : 0,

        firefox:
          execution.healedCount > 0
            ? 1
            : 0,

        webkit:
          execution.status === "FAILED"
            ? 1
            : 0,

      }));

    const heatmapData =
      executions.map((e, index) => ({

        module:
          `Execution-${index + 1}`,

        failures:
          e.status === "FAILED"
            ? 1
            : 0,

        healed:
          e.healedCount,

        severity:
          e.status === "FAILED"
            ? 90
            : 20,

      }));

    return res.status(200).json({

      success: true,

      data: {

        reportInsights,

        compatibilityData,

        heatmapData,

        executions,

      },

    });

  } catch (error: any) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

}

export default {
  getReports,
};