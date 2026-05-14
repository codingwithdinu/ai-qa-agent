import { logger } from "../../utils/logger";
import { EventEmitter } from "events";

interface QueueItem {
	id: string;
	type: string;
	data: any;
	status: "pending" | "processing" | "completed" | "failed";
	retries: number;
	createdAt: Date;
	processedAt?: Date;
}

class Queue extends EventEmitter {
	private items: Map<string, QueueItem> = new Map();
	private processing: Set<string> = new Set();

	constructor() {
		super();
	}

	/**
	 * Add item to queue
	 */
	async enqueue(type: string, data: any): Promise<string> {
		const id = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		const item: QueueItem = {
			id,
			type,
			data,
			status: "pending",
			retries: 0,
			createdAt: new Date(),
		};

		this.items.set(id, item);
		this.emit("enqueued", item);

		logger.info(`Item enqueued: ${id}`, { type, status: "pending" });

		return id;
	}

	/**
	 * Get next item from queue
	 */
	async dequeue(): Promise<QueueItem | null> {
		for (const [id, item] of this.items) {
			if (item.status === "pending" && !this.processing.has(id)) {
				this.processing.add(id);
				item.status = "processing";
				logger.info(`Item dequeued: ${id}`, { type: item.type });
				return item;
			}
		}
		return null;
	}

	/**
	 * Mark item as completed
	 */
	async complete(id: string): Promise<void> {
		const item = this.items.get(id);
		if (item) {
			item.status = "completed";
			item.processedAt = new Date();
			this.processing.delete(id);
			this.emit("completed", item);
			logger.info(`Item completed: ${id}`);
		}
	}

	/**
	 * Mark item as failed
	 */
	async fail(id: string, error: any): Promise<void> {
		const item = this.items.get(id);
		if (item) {
			item.retries++;
			if (item.retries < 3) {
				item.status = "pending";
				logger.warn(`Item failed, retrying: ${id}`, { retries: item.retries, error });
			} else {
				item.status = "failed";
				logger.error(`Item failed permanently: ${id}`, error);
				this.emit("failed", { item, error });
			}
			this.processing.delete(id);
		}
	}

	/**
	 * Get queue statistics
	 */
	getStats(): any {
		const stats = {
			total: this.items.size,
			pending: 0,
			processing: this.processing.size,
			completed: 0,
			failed: 0,
		};

		for (const item of this.items.values()) {
			if (item.status === "pending") stats.pending++;
			if (item.status === "completed") stats.completed++;
			if (item.status === "failed") stats.failed++;
		}

		return stats;
	}
}

export const queue = new Queue();

export default queue;
