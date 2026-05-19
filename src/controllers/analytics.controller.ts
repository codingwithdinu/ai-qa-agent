import { Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth.middleware";

export async function getAnalytics(
  req: AuthRequest,
  res: Response
) {

  try {

    const executions =
      await prisma.testExecution.findMany({

        where: {
          recording: {
            userId: req.userId!,
          },
        },

      });

    const totalTests =
      executions.length;

    const passedTests =
      executions.filter(
        (e) => e.status === "PASSED"
      ).length;

    const failedTests =
      executions.filter(
        (e) => e.status === "FAILED"
      ).length;

    const avgDuration =
      totalTests > 0
        ? executions.reduce(
            (acc, curr) =>
              acc + curr.duration,
            0
          ) / totalTests
        : 0;

    const healedTests =
      executions.reduce(
        (acc, curr) =>
          acc + curr.healedCount,
        0
      );

    return res.json({

      success: true,

      data: {

        totalTests,

        passedTests,

        failedTests,

        healedTests,

        avgDuration:
          Number(avgDuration.toFixed(2)),

        releaseConfidence:
          totalTests > 0
            ? Math.round(
                (passedTests / totalTests) * 100
              )
            : 0,

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
  getAnalytics,
};