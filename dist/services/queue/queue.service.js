"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queue = void 0;
const logger_1 = require("../../utils/logger");
const events_1 = require("events");
class Queue extends events_1.EventEmitter {
    constructor() {
        super();
        this.items = new Map();
        this.processing = new Set();
    }
    /**
     * Add item to queue
     */
    async enqueue(type, data) {
        const id = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const item = {
            id,
            type,
            data,
            status: "pending",
            retries: 0,
            createdAt: new Date(),
        };
        this.items.set(id, item);
        this.emit("enqueued", item);
        logger_1.logger.info(`Item enqueued: ${id}`, { type, status: "pending" });
        return id;
    }
    /**
     * Get next item from queue
     */
    async dequeue() {
        for (const [id, item] of this.items) {
            if (item.status === "pending" && !this.processing.has(id)) {
                this.processing.add(id);
                item.status = "processing";
                logger_1.logger.info(`Item dequeued: ${id}`, { type: item.type });
                return item;
            }
        }
        return null;
    }
    /**
     * Mark item as completed
     */
    async complete(id) {
        const item = this.items.get(id);
        if (item) {
            item.status = "completed";
            item.processedAt = new Date();
            this.processing.delete(id);
            this.emit("completed", item);
            logger_1.logger.info(`Item completed: ${id}`);
        }
    }
    /**
     * Mark item as failed
     */
    async fail(id, error) {
        const item = this.items.get(id);
        if (item) {
            item.retries++;
            if (item.retries < 3) {
                item.status = "pending";
                logger_1.logger.warn(`Item failed, retrying: ${id}`, { retries: item.retries, error });
            }
            else {
                item.status = "failed";
                logger_1.logger.error(`Item failed permanently: ${id}`, error);
                this.emit("failed", { item, error });
            }
            this.processing.delete(id);
        }
    }
    /**
     * Get queue statistics
     */
    getStats() {
        const stats = {
            total: this.items.size,
            pending: 0,
            processing: this.processing.size,
            completed: 0,
            failed: 0,
        };
        for (const item of this.items.values()) {
            if (item.status === "pending")
                stats.pending++;
            if (item.status === "completed")
                stats.completed++;
            if (item.status === "failed")
                stats.failed++;
        }
        return stats;
    }
}
exports.queue = new Queue();
exports.default = exports.queue;
//# sourceMappingURL=queue.service.js.map