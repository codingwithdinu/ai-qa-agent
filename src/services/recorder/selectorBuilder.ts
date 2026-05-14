import { logger } from "../../utils/logger";
import { Page } from "playwright";

/**
 * Build CSS selector for element
 */
export function buildSelector(element: HTMLElement): string {
	// Use ID if available
	if (element.id) {
		return `#${element.id}`;
	}

	// Use unique class combination
	if (element.className) {
		const classes = (element.className as string).split(" ").filter((c) => c.length > 0);
		if (classes.length > 0) {
			return `.${classes.join(".")}`;
		}
	}

	// Build path-based selector
	const path: string[] = [];
	let current: HTMLElement | null = element;

	while (current && current !== document.documentElement) {
		const tag = current.tagName.toLowerCase();
		let selector = tag;

		// Add index if there are siblings with same tag
		const siblings = (current.parentElement?.children || []) as HTMLCollection;
		const sameTagSiblings = Array.from(siblings).filter((s) => s.tagName.toLowerCase() === tag);

		if (sameTagSiblings.length > 1) {
			const index = sameTagSiblings.indexOf(current) + 1;
			selector = `${tag}:nth-child(${index})`;
		}

		// Add class if available
		if (current.className) {
			const classes = (current.className as string).split(" ")[0];
			if (classes) {
				selector = `${tag}.${classes}`;
			}
		}

		path.unshift(selector);
		current = current.parentElement;

		// Stop at reasonable depth
		if (path.length > 5) break;
	}

	return path.join(" > ");
}

/**
 * Get element by selector for recording
 */
export async function getElementSelector(page: Page, selector: string): Promise<string> {
	try {
		const element = await page.$(selector);

		if (!element) {
			logger.warn(`Element not found with selector: ${selector}`);
			return selector;
		}

		return selector;
	} catch (error: any) {
		logger.error("Error getting element selector", error);
		return selector;
	}
}

export default {
	buildSelector,
	getElementSelector,
};
