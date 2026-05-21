"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSelector = buildSelector;
exports.getElementSelector = getElementSelector;
const logger_1 = require("../../utils/logger");
/**
 * Build CSS selector for element
 */
function buildSelector(element) {
    // Use ID if available
    if (element.id) {
        return `#${element.id}`;
    }
    // Use unique class combination
    if (element.className) {
        const classes = element.className.split(" ").filter((c) => c.length > 0);
        if (classes.length > 0) {
            return `.${classes.join(".")}`;
        }
    }
    // Build path-based selector
    const path = [];
    let current = element;
    while (current && current !== document.documentElement) {
        const tag = current.tagName.toLowerCase();
        let selector = tag;
        // Add index if there are siblings with same tag
        const siblings = (current.parentElement?.children || []);
        const sameTagSiblings = Array.from(siblings).filter((s) => s.tagName.toLowerCase() === tag);
        if (sameTagSiblings.length > 1) {
            const index = sameTagSiblings.indexOf(current) + 1;
            selector = `${tag}:nth-child(${index})`;
        }
        // Add class if available
        if (current.className) {
            const classes = current.className.split(" ")[0];
            if (classes) {
                selector = `${tag}.${classes}`;
            }
        }
        path.unshift(selector);
        current = current.parentElement;
        // Stop at reasonable depth
        if (path.length > 5)
            break;
    }
    return path.join(" > ");
}
/**
 * Get element by selector for recording
 */
async function getElementSelector(page, selector) {
    try {
        const element = await page.$(selector);
        if (!element) {
            logger_1.logger.warn(`Element not found with selector: ${selector}`);
            return selector;
        }
        return selector;
    }
    catch (error) {
        logger_1.logger.error("Error getting element selector", error);
        return selector;
    }
}
exports.default = {
    buildSelector,
    getElementSelector,
};
//# sourceMappingURL=selectorBuilder.js.map