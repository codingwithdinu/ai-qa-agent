"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeScreenshot = takeScreenshot;
exports.takeFailureScreenshot = takeFailureScreenshot;
exports.compareScreenshots = compareScreenshots;
const logger_1 = require("../../utils/logger");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/**
 * Take screenshot of page
 */
async function takeScreenshot(page, name) {
    try {
        const screenshotDir = "./screenshots";
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        const filename = `${name}-${Date.now()}.png`;
        const filepath = path.join(screenshotDir, filename);
        await page.screenshot({ path: filepath, fullPage: true });
        logger_1.logger.info(`Screenshot taken: ${filename}`);
        return filepath;
    }
    catch (error) {
        logger_1.logger.error("Screenshot error", error);
        throw error;
    }
}
/**
 * Take screenshot on failure
 */
async function takeFailureScreenshot(page, testName) {
    try {
        return await takeScreenshot(page, `failure-${testName}`);
    }
    catch (error) {
        logger_1.logger.error("Failure screenshot error", error);
        return null;
    }
}
/**
 * Compare screenshots
 */
function compareScreenshots(path1, path2) {
    // Simple file size comparison (in production, use pixel-perfect comparison)
    try {
        const stat1 = fs.statSync(path1);
        const stat2 = fs.statSync(path2);
        // Consider similar if within 10% file size difference
        const sizeDiff = Math.abs(stat1.size - stat2.size) / stat1.size;
        return sizeDiff < 0.1;
    }
    catch (error) {
        logger_1.logger.error("Screenshot comparison error", error);
        return false;
    }
}
exports.default = {
    takeScreenshot,
    takeFailureScreenshot,
    compareScreenshots,
};
//# sourceMappingURL=screenshot.service.js.map