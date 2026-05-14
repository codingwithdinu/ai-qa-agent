import prisma from "../../config/database";

/**
 * Get all test executions
 */
export async function getAllExecutions() {

  return await prisma.testExecution.findMany({

    orderBy: {
      createdAt: "desc",
    },

  });

}

/**
 * Get execution by ID
 */
export async function getExecutionById(
  id: string
) {

  return await prisma.testExecution.findUnique({

    where: {
      id,
    },

  });

}

/**
 * Get failed executions
 */
export async function getFailedExecutions() {

  return await prisma.testExecution.findMany({

    where: {
      status: "FAILED",
    },

    orderBy: {
      createdAt: "desc",
    },

  });

}

/**
 * Get execution analytics stats
 */
export async function getExecutionStats() {

  const executions =
    await prisma.testExecution.findMany();

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
      ? (
          (passedTests / totalTests) * 100
        ).toFixed(2)
      : "0";

  return {

    totalTests,

    passedTests,

    failedTests,

    totalHealing,

    avgDuration,

    healingSuccessRate,

  };

}

export default {

  getAllExecutions,
  getExecutionById,
  getFailedExecutions,
  getExecutionStats,

};