export const RECORDING_TYPES = ["navigate", "click", "type", "wait", "screenshot", "refresh"] as const;
export const TEST_STATUS = ["pending", "running", "passed", "failed"] as const;
export const REPORT_FORMATS = ["markdown", "html", "json", "pdf"] as const;

export const DEFAULT_TIMEOUT = 30000;
export const DEFAULT_RETRY_ATTEMPTS = 3;
export const DEFAULT_RETRY_DELAY = 1000;

export const UPLOAD_DIR = "./uploads";
export const RECORDINGS_DIR = "./recordings";
export const REPORTS_DIR = "./reports";
export const SCREENSHOTS_DIR = "./screenshots";
export const LOGS_DIR = "./logs";

export const SESSION_TIMEOUT = 3600000; // 1 hour
export const SESSION_REFRESH_INTERVAL = 300000; // 5 minutes

export const API_VERSION = "v1";
export const API_PREFIX = `/api/${API_VERSION}`;

export default {
	RECORDING_TYPES,
	TEST_STATUS,
	REPORT_FORMATS,
	DEFAULT_TIMEOUT,
	DEFAULT_RETRY_ATTEMPTS,
	DEFAULT_RETRY_DELAY,
	UPLOAD_DIR,
	RECORDINGS_DIR,
	REPORTS_DIR,
	SCREENSHOTS_DIR,
	LOGS_DIR,
	SESSION_TIMEOUT,
	SESSION_REFRESH_INTERVAL,
	API_VERSION,
	API_PREFIX,
};
