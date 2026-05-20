"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTestCaseFile = generateTestCaseFile;
exports.validateTestCode = validateTestCode;
const logger_1 = require("../../utils/logger");
const database_1 = __importDefault(require("../../config/database"));
/**
 * Generate test case file from recording
 */
async function generateTestCaseFile(recordingId, format = "typescript") {
    try {
        const recording = await database_1.default.recording.findUnique({ where: { id: recordingId } });
        if (!recording) {
            throw new Error("Recording not found");
        }
        const events = JSON.parse(recording.events);
        let testCode = "";
        if (format === "typescript") {
            testCode = `import { test, expect } from '@playwright/test';

test.describe('Test Suite', () => {
  test('should execute recorded steps', async ({ page }) => {
`;
        }
        else {
            testCode = `const { test, expect } = require('@playwright/test');

test.describe('Test Suite', () => {
  test('should execute recorded steps', async ({ page }) => {
`;
        }
        events.forEach((event, index) => {
            testCode += generateStepCode(event, index, format);
        });
        testCode += `  });
});`;
        logger_1.logger.info(`Generated test case file for recording ${recordingId}`);
        return testCode;
    }
    catch (error) {
        logger_1.logger.error("Test case file generation error", error);
        throw error;
    }
}
function generateStepCode(event, index, format) {
    let code = `    // Step ${index + 1}\n`;
    switch (event.type) {
        case "navigate":
            code += `    await page.goto('${event.url}');\n`;
            break;
        case "click":
            code += `    await page.click('${event.selector}');\n`;
            break;
        case "type":
            code += `    await page.fill('${event.selector}', '${event.text}');\n`;
            break;
        case "wait":
            code += `    await page.waitForTimeout(${event.ms});\n`;
            break;
        case "screenshot":
            code += `    await page.screenshot({ path: 'step-${index}.png' });\n`;
            break;
        case "refresh":
            code += `    await page.reload();\n`;
            break;
    }
    code += "\n";
    return code;
}
/**
 * Validate generated test code
 */
async function validateTestCode(code) {
    try {
        // Basic syntax check
        if (!code.includes("test") && !code.includes("describe")) {
            logger_1.logger.warn("Generated code missing test framework keywords");
            return false;
        }
        logger_1.logger.info("Test code validation passed");
        return true;
    }
    catch (error) {
        logger_1.logger.error("Test code validation error", error);
        return false;
    }
}
exports.default = {
    generateTestCaseFile,
    validateTestCode,
};
//# sourceMappingURL=testcaseGenerator.js.map