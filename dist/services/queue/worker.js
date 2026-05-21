"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.worker = exports.QueueWorker = void 0;
const logger_1 = require("../../utils/logger");
const queue_service_1 = require("./queue.service");
/**
 * Worker to process queue items
 */
class QueueWorker {
    constructor() {
        this.isRunning = false;
        this.interval = null;
    }
    async start() {
        if (this.isRunning)
            return;
        this.isRunning = true;
        logger_1.logger.info("Queue worker started");
        this.interval = setInterval(async () => {
            await this.processNext();
        }, 1000);
    }
    async stop() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
        }
        logger_1.logger.info("Queue worker stopped");
    }
    async processNext() {
        try {
            const item = await queue_service_1.queue.dequeue();
            if (!item)
                return;
            logger_1.logger.info(`Processing queue item: ${item.id}`, { type: item.type });
            try {
                // Process based on type
                if (item.type === "recording") {
                    await this.processRecording(item);
                }
                else if (item.type === "test_run") {
                    await this.processTestRun(item);
                }
                else if (item.type === "report") {
                    await this.processReport(item);
                }
                await queue_service_1.queue.complete(item.id);
            }
            catch (error) {
                await queue_service_1.queue.fail(item.id, error);
            }
        }
        catch (error) {
            logger_1.logger.error("Queue worker processing error", error);
        }
    }
    async processRecording(item) {
        logger_1.logger.info(`Processing recording: ${item.data.recordingId}`);
        // Actual processing logic would go here
    }
    async processTestRun(item) {
        logger_1.logger.info(`Processing test run: ${item.data.testRunId}`);
        // Actual processing logic would go here
    }
    async processReport(item) {
        logger_1.logger.info(`Processing report: ${item.data.reportId}`);
        // Actual processing logic would go here
    }
}
exports.QueueWorker = QueueWorker;
exports.worker = new QueueWorker();
exports.default = { worker: exports.worker, QueueWorker };
//# sourceMappingURL=worker.js.map