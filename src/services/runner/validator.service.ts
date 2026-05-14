import { logger } from "../../utils/logger";
import { Page } from "playwright";

/**
 * Validate page state and content
 */
export async function validatePageState(page: Page, expectedUrl?: string, expectedTitle?: string): Promise<boolean> {
	try {
		if (expectedUrl && !page.url().includes(expectedUrl)) {
			logger.warn(`URL validation failed. Expected: ${expectedUrl}, Got: ${page.url()}`);
			return false;
		}

		if (expectedTitle && (await page.title()) !== expectedTitle) {
			logger.warn(`Title validation failed. Expected: ${expectedTitle}, Got: ${await page.title()}`);
			return false;
		}

		logger.debug("Page state validation passed");
		return true;
	} catch (error: any) {
		logger.error("Page state validation error", error);
		return false;
	}
}

/**
 * Check if element exists and is visible
 */
export async function validateElement(page: Page, selector: string): Promise<boolean> {
	try {
		const element = await page.$(selector);

		if (!element) {
			logger.warn(`Element not found: ${selector}`);
			return false;
		}

		const isVisible = await element.isVisible();
		if (!isVisible) {
			logger.warn(`Element not visible: ${selector}`);
			return false;
		}

		return true;
	} catch (error: any) {
		logger.error("Element validation error", error);
		return false;
	}
}

/**
 * Validate text content
 */
export async function validateText(page: Page, selector: string, expectedText: string): Promise<boolean> {
	try {
		const text = await page.textContent(selector);

		if (!text?.includes(expectedText)) {
			logger.warn(`Text validation failed. Selector: ${selector}, Expected: ${expectedText}, Got: ${text}`);
			return false;
		}

		return true;
	} catch (error: any) {
		logger.error("Text validation error", error);
		return false;
	}
}

export default {
	validatePageState,
	validateElement,
	validateText,
};
