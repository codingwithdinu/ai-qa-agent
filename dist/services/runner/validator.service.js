"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePageState = validatePageState;
exports.validateElement = validateElement;
exports.validateText = validateText;
const logger_1 = require("../../utils/logger");
/**
 * Validate page state and content
 */
async function validatePageState(page, expectedUrl, expectedTitle) {
    try {
        if (expectedUrl && !page.url().includes(expectedUrl)) {
            logger_1.logger.warn(`URL validation failed. Expected: ${expectedUrl}, Got: ${page.url()}`);
            return false;
        }
        if (expectedTitle && (await page.title()) !== expectedTitle) {
            logger_1.logger.warn(`Title validation failed. Expected: ${expectedTitle}, Got: ${await page.title()}`);
            return false;
        }
        logger_1.logger.debug("Page state validation passed");
        return true;
    }
    catch (error) {
        logger_1.logger.error("Page state validation error", error);
        return false;
    }
}
/**
 * Check if element exists and is visible
 */
async function validateElement(page, selector) {
    try {
        const element = await page.$(selector);
        if (!element) {
            logger_1.logger.warn(`Element not found: ${selector}`);
            return false;
        }
        const isVisible = await element.isVisible();
        if (!isVisible) {
            logger_1.logger.warn(`Element not visible: ${selector}`);
            return false;
        }
        return true;
    }
    catch (error) {
        logger_1.logger.error("Element validation error", error);
        return false;
    }
}
/**
 * Validate text content
 */
async function validateText(page, selector, expectedText) {
    try {
        const text = await page.textContent(selector);
        if (!text?.includes(expectedText)) {
            logger_1.logger.warn(`Text validation failed. Selector: ${selector}, Expected: ${expectedText}, Got: ${text}`);
            return false;
        }
        return true;
    }
    catch (error) {
        logger_1.logger.error("Text validation error", error);
        return false;
    }
}
exports.default = {
    validatePageState,
    validateElement,
    validateText,
};
//# sourceMappingURL=validator.service.js.map