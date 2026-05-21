"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserManager = exports.BrowserManager = void 0;
const logger_1 = require("../../utils/logger");
const playwright_1 = require("playwright");
/**
 * Manage browser instances
 */
class BrowserManager {
    constructor() {
        this.browsers = new Map();
        this.contexts = new Map();
    }
    async launchBrowser(id, headless = true) {
        try {
            const browser = await playwright_1.chromium.launch({ headless });
            this.browsers.set(id, browser);
            logger_1.logger.info(`Browser launched: ${id}`);
            return browser;
        }
        catch (error) {
            logger_1.logger.error("Browser launch error", error);
            throw error;
        }
    }
    async createContext(browserId, contextId, options) {
        try {
            const browser = this.browsers.get(browserId);
            if (!browser) {
                throw new Error(`Browser not found: ${browserId}`);
            }
            const context = await browser.newContext(options);
            this.contexts.set(contextId, context);
            logger_1.logger.info(`Browser context created: ${contextId}`);
            return context;
        }
        catch (error) {
            logger_1.logger.error("Context creation error", error);
            throw error;
        }
    }
    async closeBrowser(id) {
        try {
            const browser = this.browsers.get(id);
            if (browser) {
                await browser.close();
                this.browsers.delete(id);
                logger_1.logger.info(`Browser closed: ${id}`);
            }
        }
        catch (error) {
            logger_1.logger.error("Browser close error", error);
        }
    }
    async closeContext(id) {
        try {
            const context = this.contexts.get(id);
            if (context) {
                await context.close();
                this.contexts.delete(id);
                logger_1.logger.info(`Context closed: ${id}`);
            }
        }
        catch (error) {
            logger_1.logger.error("Context close error", error);
        }
    }
    getContext(id) {
        return this.contexts.get(id);
    }
    getBrowser(id) {
        return this.browsers.get(id);
    }
}
exports.BrowserManager = BrowserManager;
exports.browserManager = new BrowserManager();
exports.default = { browserManager: exports.browserManager, BrowserManager };
//# sourceMappingURL=browserManager.js.map