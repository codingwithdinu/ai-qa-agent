import { LaunchOptions, BrowserContext } from "playwright";

export const PLAYWRIGHT_CONFIG: LaunchOptions = {
	headless: process.env.HEADLESS !== "false",
	timeout: parseInt(process.env.PLAYWRIGHT_TIMEOUT || "30000"),
	slowMo: parseInt(process.env.PLAYWRIGHT_SLOW_MO || "0"),
	args: process.env.PLAYWRIGHT_ARGS ? process.env.PLAYWRIGHT_ARGS.split(",") : [],
};

export const BROWSER_CONTEXT_OPTIONS = {
	viewportSize: { width: 1280, height: 720 },
	ignoreHTTPSErrors: true,
	recordVideo: process.env.RECORD_VIDEO === "true" ? { dir: "./recordings" } : undefined,
	screenshot: process.env.RECORD_SCREENSHOTS === "true" ? "only-on-failure" : undefined,
};

export default { PLAYWRIGHT_CONFIG, BROWSER_CONTEXT_OPTIONS };
