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
exports.captureScreenshot = captureScreenshot;
exports.capturePageMetrics = capturePageMetrics;
exports.captureDOM = captureDOM;
exports.captureNetworkRequests = captureNetworkRequests;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function captureScreenshot(page, filename) {
    const screenshotDir = "./screenshots";
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }
    const filepath = path.join(screenshotDir, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    return filepath;
}
async function capturePageMetrics(page) {
    return await page.evaluate(() => {
        return {
            url: window.location.href,
            title: document.title,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
            navigation: {
                redirectCount: performance.navigation.redirectCount,
            },
            timing: performance.timing,
        };
    });
}
async function captureDOM(page, selector) {
    if (selector) {
        return await page.$eval(selector, (el) => el.outerHTML);
    }
    return await page.content();
}
async function captureNetworkRequests(page) {
    const requests = [];
    page.on("response", (response) => {
        requests.push({
            url: response.url(),
            status: response.status(),
            headers: response.headers(),
        });
    });
    return requests;
}
exports.default = {
    captureScreenshot,
    capturePageMetrics,
    captureDOM,
    captureNetworkRequests,
};
//# sourceMappingURL=screenshot.js.map