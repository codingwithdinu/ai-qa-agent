import { logger } from "../../utils/logger";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	maxRetries: number = MAX_RETRIES,
	initialDelay: number = RETRY_DELAY
): Promise<T> {
	let lastError: any;
	let delay = initialDelay;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			logger.debug(`Attempt ${attempt}/${maxRetries}`);
			return await fn();
		} catch (error: any) {
			lastError = error;
			logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms`, { error: error.message });

			if (attempt < maxRetries) {
				await new Promise((resolve) => setTimeout(resolve, delay));
				delay *= 2; // Exponential backoff
			}
		}
	}

	logger.error(`All ${maxRetries} attempts failed`, lastError);
	throw lastError;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
	maxRetries?: number;
	initialDelay?: number;
	backoffMultiplier?: number;
}

/**
 * Create retry function with custom config
 */
export function createRetryFn<T>(
	fn: () => Promise<T>,
	config: RetryConfig = {}
): () => Promise<T> {
	const { maxRetries = MAX_RETRIES, initialDelay = RETRY_DELAY } = config;

	return () => retryWithBackoff(fn, maxRetries, initialDelay);
}

export default {
	retryWithBackoff,
	createRetryFn,
};
