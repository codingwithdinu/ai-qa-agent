import { logger } from "../../utils/logger";
import { Page } from "playwright";

export interface StepAction {
	type: "navigate" | "click" | "type" | "wait" | "screenshot";
	selector?: string;
	text?: string;
	url?: string;
	ms?: number;
}

/**
 * Execute a single test step
 */
export async function executeStep(page: Page, step: StepAction, index: number): Promise<boolean> {
	try {
		logger.info(`Executing step ${index}`, step);

		switch (step.type) {
			case "navigate":
				if (!step.url) throw new Error("URL required for navigate action");
				await page.goto(step.url, { waitUntil: "load" });
				break;

			case "click":
				if (!step.selector) throw new Error("Selector required for click action");
				await page.click(step.selector);
				break;

			case "type":
				if (!step.selector || !step.text) throw new Error("Selector and text required for type action");
				await page.fill(step.selector, step.text);
				break;

			case "wait":
				const ms = step.ms || 1000;
				await page.waitForTimeout(ms);
				break;

			case "screenshot":
				await page.screenshot({ path: `screenshot-step-${index}.png` });
				break;

			default:
				logger.warn(`Unknown step type: ${step.type}`);
				return false;
		}

		logger.debug(`Step ${index} executed successfully`);
		return true;
	} catch (error: any) {
		logger.error(`Step ${index} execution failed`, error);
		return false;
	}
}

/**
 * Execute multiple steps sequentially
 */
export async function executeSteps(page: Page, steps: StepAction[]): Promise<any[]> {
	const results = [];

	for (let i = 0; i < steps.length; i++) {
		const success = await executeStep(page, steps[i], i + 1);
		results.push({
			index: i + 1,
			action: steps[i].type,
			success,
		});
	}

	return results;
}

export default {
	executeStep,
	executeSteps,
};
