"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeTestFailure = analyzeTestFailure;
exports.applySelfHealing = applySelfHealing;
const logger_1 = require("../../utils/logger");
/**
 * Analyze test failure and suggest self-healing strategies
 */
async function analyzeTestFailure(error, stepData) {
    try {
        logger_1.logger.info("Analyzing test failure for self-healing", { error, step: stepData });
        // Common failure patterns and suggestions
        if (error.includes("not found") || error.includes("timeout")) {
            return {
                isSelfHealing: true,
                suggestion: "Use more flexible selectors or add retry logic",
                code: `await page.waitForSelector('${stepData.selector}', { timeout: 5000 });`,
            };
        }
        if (error.includes("stale")) {
            return {
                isSelfHealing: true,
                suggestion: "Element became stale, re-fetching...",
                code: `await page.reload(); await page.click('${stepData.selector}');`,
            };
        }
        if (error.includes("navigation")) {
            return {
                isSelfHealing: true,
                suggestion: "Wait for navigation to complete",
                code: `await Promise.all([page.waitForNavigation(), page.click('${stepData.selector}')]);`,
            };
        }
        return {
            isSelfHealing: false,
            suggestion: "Manual intervention required",
        };
    }
    catch (error) {
        logger_1.logger.error("Self-healing analysis error", error);
        return {
            isSelfHealing: false,
            suggestion: "Analysis failed",
        };
    }
}
/**
 * Apply self-healing suggestions to recover from failures
 */
async function applySelfHealing(page, suggestion, stepData) {
    try {
        if (suggestion.includes("retry")) {
            // Retry the action
            return true;
        }
        if (suggestion.includes("reload")) {
            // Reload and try again
            await page.reload();
            return true;
        }
        if (suggestion.includes("navigation")) {
            // Wait for navigation
            await page.waitForNavigation();
            return true;
        }
        return false;
    }
    catch (error) {
        logger_1.logger.error("Self-healing application error", error);
        return false;
    }
}
exports.default = { analyzeTestFailure, applySelfHealing };
//# sourceMappingURL=selfHealing.service.js.map