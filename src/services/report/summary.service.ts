import { logger } from "../../utils/logger";
import prisma from "../../config/database";

/**
 * Generate summary report for multiple test runs
 */
export async function generateSummaryReport(recordingId: string): Promise<string> {
	try {
		const testRuns = await prisma.testRun.findMany({
			where: { recordingId },
			orderBy: { startedAt: "desc" },
		});

		const totalRuns = testRuns.length;
		const passedRuns = testRuns.filter((r: any) => r.success).length;
		const failedRuns = totalRuns - passedRuns;

		let summary = `# Recording Test Summary

**Recording ID:** ${recordingId}
**Total Test Runs:** ${totalRuns}
**Passed Runs:** ${passedRuns}
**Failed Runs:** ${failedRuns}
**Success Rate:** ${totalRuns > 0 ? ((passedRuns / totalRuns) * 100).toFixed(2) : 0}%

## Recent Test Runs

`;

				testRuns.slice(0, 10).forEach((run: any, index: number) => {
			const status = run.success ? "✅ PASSED" : "❌ FAILED";
			const startTime = new Date(run.startedAt).toLocaleString();
			const duration = run.finishedAt ? new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime() : 0;

			summary += `${index + 1}. ${status} - ${startTime} (${duration}ms)\n`;
		});

		logger.info(`Generated summary report for recording ${recordingId}`);

		return summary;
	} catch (error: any) {
		logger.error("Summary report generation error", error);
		throw error;
	}
}

export default { generateSummaryReport };
