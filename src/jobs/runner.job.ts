import { logger } from "../utils/logger";
import prisma from "../config/database";
import { runRecording } from "../services/runner/runner.service";

/**
 * Periodically run tests for all recordings
 */
export async function runScheduledTests() {
	try {
		logger.info("Starting scheduled test run job");

		const recordings = await prisma.recording.findMany();

		for (const recording of recordings) {
			try {
				logger.info(`Running test for recording ${recording.id}`);
				await runRecording(recording.id);
			} catch (error: any) {
				logger.error(`Failed to run test for recording ${recording.id}`, error);
			}
		}

		logger.info("Scheduled test run job completed");
	} catch (error: any) {
		logger.error("Scheduled test run job error", error);
	}
}

export default { runScheduledTests };
