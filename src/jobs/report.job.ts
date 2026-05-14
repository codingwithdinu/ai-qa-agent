import { logger } from "../utils/logger";
import prisma from "../config/database";
import { generateSummaryReport } from "../services/report/summary.service";
import * as fs from "fs";
import * as path from "path";

/**
 * Generate daily reports for all recordings
 */
export async function generateDailyReports() {
	try {
		logger.info("Starting daily report generation job");

		const recordings = await prisma.recording.findMany();

		for (const recording of recordings) {
			try {
				const summary = await generateSummaryReport(recording.id);

				const reportDir = "./reports";
				if (!fs.existsSync(reportDir)) {
					fs.mkdirSync(reportDir, { recursive: true });
				}

				const reportFile = path.join(reportDir, `report-${recording.id}-${Date.now()}.md`);
				fs.writeFileSync(reportFile, summary);

				logger.info(`Generated report for recording ${recording.id}`);
			} catch (error: any) {
				logger.error(`Failed to generate report for recording ${recording.id}`, error);
			}
		}

		logger.info("Daily report generation job completed");
	} catch (error: any) {
		logger.error("Daily report job error", error);
	}
}

export default { generateDailyReports };
