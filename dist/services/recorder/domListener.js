"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachDOMListener = attachDOMListener;
exports.detachDOMListener = detachDOMListener;
const logger_1 = require("../../utils/logger");
/**
 * Listen to DOM changes and events
 */
async function attachDOMListener(page) {
    try {
        await page.addInitScript(() => {
            // Listen to all user interactions
            document.addEventListener("click", (e) => {
                const target = e.target;
                console.log("DOM_CLICK", {
                    selector: getSelector(target),
                    text: target.textContent?.substring(0, 50),
                    x: e.clientX,
                    y: e.clientY,
                });
            });
            document.addEventListener("input", (e) => {
                const target = e.target;
                console.log("DOM_INPUT", {
                    selector: getSelector(target),
                    value: target.value,
                });
            });
            document.addEventListener("change", (e) => {
                const target = e.target;
                console.log("DOM_CHANGE", {
                    selector: getSelector(target),
                });
            });
            // Helper to get CSS selector
            function getSelector(element) {
                if (element.id)
                    return `#${element.id}`;
                if (element.className)
                    return `.${element.className.split(" ")[0]}`;
                let selector = element.tagName.toLowerCase();
                let current = element.parentElement;
                let depth = 0;
                while (current && depth < 3) {
                    if (current.id) {
                        selector = `#${current.id} > ${selector}`;
                        break;
                    }
                    current = current.parentElement;
                    depth++;
                }
                return selector;
            }
        });
        logger_1.logger.info("DOM listener attached to page");
    }
    catch (error) {
        logger_1.logger.error("Failed to attach DOM listener", error);
    }
}
/**
 * Detach DOM listener
 */
async function detachDOMListener(page) {
    try {
        logger_1.logger.info("DOM listener detached from page");
    }
    catch (error) {
        logger_1.logger.error("Failed to detach DOM listener", error);
    }
}
exports.default = { attachDOMListener, detachDOMListener };
//# sourceMappingURL=domListener.js.map