import { logger } from "../../utils/logger";
import { Page } from "playwright";
import * as path from "path";
import * as fs from "fs";

/**
 * Take screenshot of page
 */
export async function takeScreenshot(page: Page, name: string): Promise<string> {
	try {
		const screenshotDir = "./screenshots";

		if (!fs.existsSync(screenshotDir)) {
			fs.mkdirSync(screenshotDir, { recursive: true });
		}

		const filename = `${name}-${Date.now()}.png`;
		const filepath = path.join(screenshotDir, filename);

		await page.screenshot({ path: filepath, fullPage: true });

		logger.info(`Screenshot taken: ${filename}`);

		return filepath;
	} catch (error: any) {
		logger.error("Screenshot error", error);
		throw error;
	}
}

/**
 * Take screenshot on failure
 */
export async function takeFailureScreenshot(page: Page, testName: string): Promise<string | null> {
	try {
		return await takeScreenshot(page, `failure-${testName}`);
	} catch (error: any) {
		logger.error("Failure screenshot error", error);
		return null;
	}
}

/**
 * Compare screenshots
 */
export function compareScreenshots(path1: string, path2: string): boolean {
	// Simple file size comparison (in production, use pixel-perfect comparison)
	try {
		const stat1 = fs.statSync(path1);
		const stat2 = fs.statSync(path2);

		// Consider similar if within 10% file size difference
		const sizeDiff = Math.abs(stat1.size - stat2.size) / stat1.size;
		return sizeDiff < 0.1;
	} catch (error: any) {
		logger.error("Screenshot comparison error", error);
		return false;
	}
}

export default {
	takeScreenshot,
	takeFailureScreenshot,
	compareScreenshots,
};
