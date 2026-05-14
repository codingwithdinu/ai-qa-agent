import * as fs from "fs";
import * as path from "path";
import { chromium } from "playwright";

export async function captureScreenshot(page: any, filename: string): Promise<string> {
	const screenshotDir = "./screenshots";

	if (!fs.existsSync(screenshotDir)) {
		fs.mkdirSync(screenshotDir, { recursive: true });
	}

	const filepath = path.join(screenshotDir, filename);
	await page.screenshot({ path: filepath, fullPage: true });

	return filepath;
}

export async function capturePageMetrics(page: any): Promise<any> {
	return await page.evaluate(() => {
		return {
			url: window.location.href,
			title: document.title,
			viewport: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
			navigation: {
				redirectCount: (performance as any).navigation.redirectCount,
			},
			timing: (performance as any).timing,
		};
	});
}

export async function captureDOM(page: any, selector?: string): Promise<string> {
	if (selector) {
		return await page.$eval(selector, (el: any) => el.outerHTML);
	}
	return await page.content();
}

export async function captureNetworkRequests(page: any): Promise<any[]> {
	const requests: any[] = [];

	page.on("response", (response: any) => {
		requests.push({
			url: response.url(),
			status: response.status(),
			headers: response.headers(),
		});
	});

	return requests;
}

export default {
	captureScreenshot,
	capturePageMetrics,
	captureDOM,
	captureNetworkRequests,
};
