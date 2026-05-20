"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_PREFIX = exports.API_VERSION = exports.SESSION_REFRESH_INTERVAL = exports.SESSION_TIMEOUT = exports.LOGS_DIR = exports.SCREENSHOTS_DIR = exports.REPORTS_DIR = exports.RECORDINGS_DIR = exports.UPLOAD_DIR = exports.DEFAULT_RETRY_DELAY = exports.DEFAULT_RETRY_ATTEMPTS = exports.DEFAULT_TIMEOUT = exports.REPORT_FORMATS = exports.TEST_STATUS = exports.RECORDING_TYPES = void 0;
exports.RECORDING_TYPES = ["navigate", "click", "type", "wait", "screenshot", "refresh"];
exports.TEST_STATUS = ["pending", "running", "passed", "failed"];
exports.REPORT_FORMATS = ["markdown", "html", "json", "pdf"];
exports.DEFAULT_TIMEOUT = 30000;
exports.DEFAULT_RETRY_ATTEMPTS = 3;
exports.DEFAULT_RETRY_DELAY = 1000;
exports.UPLOAD_DIR = "./uploads";
exports.RECORDINGS_DIR = "./recordings";
exports.REPORTS_DIR = "./reports";
exports.SCREENSHOTS_DIR = "./screenshots";
exports.LOGS_DIR = "./logs";
exports.SESSION_TIMEOUT = 3600000; // 1 hour
exports.SESSION_REFRESH_INTERVAL = 300000; // 5 minutes
exports.API_VERSION = "v1";
exports.API_PREFIX = `/api/${exports.API_VERSION}`;
exports.default = {
    RECORDING_TYPES: exports.RECORDING_TYPES,
    TEST_STATUS: exports.TEST_STATUS,
    REPORT_FORMATS: exports.REPORT_FORMATS,
    DEFAULT_TIMEOUT: exports.DEFAULT_TIMEOUT,
    DEFAULT_RETRY_ATTEMPTS: exports.DEFAULT_RETRY_ATTEMPTS,
    DEFAULT_RETRY_DELAY: exports.DEFAULT_RETRY_DELAY,
    UPLOAD_DIR: exports.UPLOAD_DIR,
    RECORDINGS_DIR: exports.RECORDINGS_DIR,
    REPORTS_DIR: exports.REPORTS_DIR,
    SCREENSHOTS_DIR: exports.SCREENSHOTS_DIR,
    LOGS_DIR: exports.LOGS_DIR,
    SESSION_TIMEOUT: exports.SESSION_TIMEOUT,
    SESSION_REFRESH_INTERVAL: exports.SESSION_REFRESH_INTERVAL,
    API_VERSION: exports.API_VERSION,
    API_PREFIX: exports.API_PREFIX,
};
//# sourceMappingURL=constants.js.map