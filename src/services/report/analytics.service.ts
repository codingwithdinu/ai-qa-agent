import { logger } from "../../utils/logger";
import prisma from "../../config/database";

/**
 * Generate analytics from test runs
 */
export async function generateAnalytics(recordingId: string): Promise<any> {
	try {
		const testRuns = await prisma.testRun.findMany({
			where: { recordingId },
		});

		const parsedRuns = testRuns.map((run: any) => ({
			...run,
			steps: JSON.parse(run.steps || "[]") as any[],
		}));

		const totalRuns = parsedRuns.length;
		const passedRuns = parsedRuns.filter((r: any) => r.success).length;
		const failedRuns = totalRuns - passedRuns;

		const totalSteps = parsedRuns.reduce((sum: number, run: any) => sum + run.steps.length, 0);
		const passedSteps = parsedRuns.reduce((sum: number, run: any) => {
			const passed = run.steps.filter((s: any) => s.success).length;
			return sum + passed;
		}, 0);

		const avgDuration = parsedRuns.reduce((sum: number, run: any) => {
			const start = new Date(run.startedAt).getTime();
			const end = new Date(run.finishedAt || new Date()).getTime();
			return sum + (end - start);
		}, 0) / (totalRuns || 1);

		const analytics = {
			totalRuns,
			passedRuns,
			failedRuns,
			successRate: ((passedRuns / totalRuns) * 100).toFixed(2),
			totalSteps,
			passedSteps,
			failedSteps: totalSteps - passedSteps,
			stepSuccessRate: ((passedSteps / totalSteps) * 100).toFixed(2),
			avgDuration: Math.round(avgDuration),
			lastRun: parsedRuns[0]?.startedAt,
		};

		logger.info(`Generated analytics for recording ${recordingId}`, analytics);

		return analytics;
	} catch (error: any) {
		logger.error("Analytics generation error", error);
		throw error;
	}
}

export default { generateAnalytics };
