"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryWithBackoff = retryWithBackoff;
exports.createRetryFn = createRetryFn;
const logger_1 = require("../../utils/logger");
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = MAX_RETRIES, initialDelay = RETRY_DELAY) {
    let lastError;
    let delay = initialDelay;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            logger_1.logger.debug(`Attempt ${attempt}/${maxRetries}`);
            return await fn();
        }
        catch (error) {
            lastError = error;
            logger_1.logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms`, { error: error.message });
            if (attempt < maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }
    logger_1.logger.error(`All ${maxRetries} attempts failed`, lastError);
    throw lastError;
}
/**
 * Create retry function with custom config
 */
function createRetryFn(fn, config = {}) {
    const { maxRetries = MAX_RETRIES, initialDelay = RETRY_DELAY } = config;
    return () => retryWithBackoff(fn, maxRetries, initialDelay);
}
exports.default = {
    retryWithBackoff,
    createRetryFn,
};
//# sourceMappingURL=retry.service.js.map