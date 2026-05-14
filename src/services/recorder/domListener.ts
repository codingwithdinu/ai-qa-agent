import { logger } from "../../utils/logger";
import { Page } from "playwright";

/**
 * Listen to DOM changes and events
 */
export async function attachDOMListener(page: Page): Promise<void> {
	try {
		await page.addInitScript(() => {
			// Listen to all user interactions
			document.addEventListener("click", (e: any) => {
				const target = e.target as HTMLElement;
				console.log("DOM_CLICK", {
					selector: getSelector(target),
					text: target.textContent?.substring(0, 50),
					x: e.clientX,
					y: e.clientY,
				});
			});

			document.addEventListener("input", (e: any) => {
				const target = e.target as HTMLInputElement;
				console.log("DOM_INPUT", {
					selector: getSelector(target),
					value: target.value,
				});
			});

			document.addEventListener("change", (e: any) => {
				const target = e.target as HTMLElement;
				console.log("DOM_CHANGE", {
					selector: getSelector(target),
				});
			});

			// Helper to get CSS selector
			function getSelector(element: HTMLElement): string {
				if (element.id) return `#${element.id}`;
				if (element.className) return `.${element.className.split(" ")[0]}`;

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

		logger.info("DOM listener attached to page");
	} catch (error: any) {
		logger.error("Failed to attach DOM listener", error);
	}
}

/**
 * Detach DOM listener
 */
export async function detachDOMListener(page: Page): Promise<void> {
	try {
		logger.info("DOM listener detached from page");
	} catch (error: any) {
		logger.error("Failed to detach DOM listener", error);
	}
}

export default { attachDOMListener, detachDOMListener };
