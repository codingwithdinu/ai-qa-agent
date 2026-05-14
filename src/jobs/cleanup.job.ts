import { logger } from "../utils/logger";
import prisma from "../config/database";
import * as fs from "fs";
import * as path from "path";

/**
 * Cleanup old recordings and test data
 */
export async function cleanupOldData() {
	try {
		logger.info("Starting cleanup job");

		const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

		// Delete old recordings
		const deletedRecordings = await prisma.recording.deleteMany({
			where: {
				createdAt: {
					lt: THIRTY_DAYS_AGO,
				},
			},
		});

		logger.info(`Deleted ${deletedRecordings.count} old recordings`);

		// Delete old test runs
		const deletedTestRuns = await prisma.testRun.deleteMany({
			where: {
				startedAt: {
					lt: THIRTY_DAYS_AGO,
				},
			},
		});

		logger.info(`Deleted ${deletedTestRuns.count} old test runs`);

		// Cleanup local files
		await cleanupLocalFiles();

		logger.info("Cleanup job completed successfully");
	} catch (error: any) {
		logger.error("Cleanup job error", error);
	}
}

async function cleanupLocalFiles() {
	const dirs = ["./screenshots", "./recordings", "./reports"];

	for (const dir of dirs) {
		if (!fs.existsSync(dir)) continue;

		const files = fs.readdirSync(dir);
		const THIRTY_DAYS_AGO = Date.now() - 30 * 24 * 60 * 60 * 1000;

		for (const file of files) {
			const filepath = path.join(dir, file);
			const stat = fs.statSync(filepath);

			if (stat.mtimeMs < THIRTY_DAYS_AGO) {
				fs.unlinkSync(filepath);
				logger.debug(`Deleted old file: ${filepath}`);
			}
		}
	}
}

export default { cleanupOldData };
