import { logger } from "../../utils/logger";
import { chromium, Browser, BrowserContext } from "playwright";

/**
 * Manage browser instances
 */
export class BrowserManager {
	private browsers: Map<string, Browser> = new Map();
	private contexts: Map<string, BrowserContext> = new Map();

	async launchBrowser(id: string, headless: boolean = true): Promise<Browser> {
		try {
			const browser = await chromium.launch({ headless });
			this.browsers.set(id, browser);
			logger.info(`Browser launched: ${id}`);
			return browser;
		} catch (error: any) {
			logger.error("Browser launch error", error);
			throw error;
		}
	}

	async createContext(browserId: string, contextId: string, options?: any): Promise<BrowserContext> {
		try {
			const browser = this.browsers.get(browserId);
			if (!browser) {
				throw new Error(`Browser not found: ${browserId}`);
			}

			const context = await browser.newContext(options);
			this.contexts.set(contextId, context);
			logger.info(`Browser context created: ${contextId}`);
			return context;
		} catch (error: any) {
			logger.error("Context creation error", error);
			throw error;
		}
	}

	async closeBrowser(id: string): Promise<void> {
		try {
			const browser = this.browsers.get(id);
			if (browser) {
				await browser.close();
				this.browsers.delete(id);
				logger.info(`Browser closed: ${id}`);
			}
		} catch (error: any) {
			logger.error("Browser close error", error);
		}
	}

	async closeContext(id: string): Promise<void> {
		try {
			const context = this.contexts.get(id);
			if (context) {
				await context.close();
				this.contexts.delete(id);
				logger.info(`Context closed: ${id}`);
			}
		} catch (error: any) {
			logger.error("Context close error", error);
		}
	}

	getContext(id: string): BrowserContext | undefined {
		return this.contexts.get(id);
	}

	getBrowser(id: string): Browser | undefined {
		return this.browsers.get(id);
	}
}

export const browserManager = new BrowserManager();

export default { browserManager, BrowserManager };
