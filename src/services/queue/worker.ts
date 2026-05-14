import { logger } from "../../utils/logger";
import { queue } from "./queue.service";
import prisma from "../../config/database";

/**
 * Worker to process queue items
 */
export class QueueWorker {
	private isRunning: boolean = false;
	private interval: ReturnType<typeof setInterval> | null = null;

	async start() {
		if (this.isRunning) return;

		this.isRunning = true;
		logger.info("Queue worker started");

		this.interval = setInterval(async () => {
			await this.processNext();
		}, 1000);
	}

	async stop() {
		this.isRunning = false;
		if (this.interval) {
			clearInterval(this.interval);
		}
		logger.info("Queue worker stopped");
	}

	private async processNext() {
		try {
			const item = await queue.dequeue();

			if (!item) return;

			logger.info(`Processing queue item: ${item.id}`, { type: item.type });

			try {
				// Process based on type
				if (item.type === "recording") {
					await this.processRecording(item);
				} else if (item.type === "test_run") {
					await this.processTestRun(item);
				} else if (item.type === "report") {
					await this.processReport(item);
				}

				await queue.complete(item.id);
			} catch (error: any) {
				await queue.fail(item.id, error);
			}
		} catch (error: any) {
			logger.error("Queue worker processing error", error);
		}
	}

	private async processRecording(item: any) {
		logger.info(`Processing recording: ${item.data.recordingId}`);
		// Actual processing logic would go here
	}

	private async processTestRun(item: any) {
		logger.info(`Processing test run: ${item.data.testRunId}`);
		// Actual processing logic would go here
	}

	private async processReport(item: any) {
		logger.info(`Processing report: ${item.data.reportId}`);
		// Actual processing logic would go here
	}
}

export const worker = new QueueWorker();

export default { worker, QueueWorker };
