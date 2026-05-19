import prisma from "../../config/database";

/**
 * Get all test executions
 */
export async function getAllExecutions(
  userId: string
) {
  return await prisma.testExecution.findMany({
    where: {
      recording: {
        userId: userId,
      },
    },

    orderBy: {
      createdAt: "desc",
    },

  });
}

/**
 * Get execution by ID
 */
export async function getExecutionById(
  id: string,
  userId: string
) {
  return await prisma.testExecution.findFirst({

    where: {
      id,
      recording: {
        userId: userId,
      },
    },

  });

}

/**
 * Get failed executions
 */
export async function getFailedExecutions(
  userId: string
) {

  return await prisma.testExecution.findMany({

    where: {

      status: "FAILED",

      recording: {
        userId: userId,
      },

    },

    orderBy: {
      createdAt: "desc",
    },

  });

}

/**
 * Get execution analytics stats
 */
export async function getExecutionStats(
  userId: string
) {

  const executions =
    await prisma.testExecution.findMany({

      where: {
        recording: {
          userId: userId,
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

  const totalHealing =
    executions.reduce(
      (acc, curr) =>
        acc + curr.healedCount,
      0
    );

  const avgDuration =
    totalTests > 0
      ? executions.reduce(
        (acc, curr) =>
          acc + curr.duration,
        0
      ) / totalTests
      : 0;

  const healingSuccessRate =
    totalTests > 0
      ? Number(
        (
          (passedTests / totalTests) *
          100
        ).toFixed(2)
      )
      : 0;

  const recentFailures =
    executions
      .filter(
        (e) => e.status === "FAILED"
      )
      .slice(0, 5);

  return {

    totalTests,

    passedTests,

    failedTests,

    totalHealing,

    avgDuration:
      Number(
        avgDuration.toFixed(2)
      ),

    healingSuccessRate,

    recentFailures,

    executionTrend: executions.map(
      (e) => ({
        id: e.id,
        status: e.status,
        duration: e.duration,
        createdAt: e.createdAt,
      })
    ),

  };

}

export default {

  getAllExecutions,
  getExecutionById,
  getFailedExecutions,
  getExecutionStats,

};