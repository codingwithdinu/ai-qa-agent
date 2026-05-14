"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePlaywrightCode = generatePlaywrightCode;
exports.generatePageObjectModel = generatePageObjectModel;
const logger_1 = require("../../utils/logger");
/**
 * Generate Playwright test code from recording events
 */
function generatePlaywrightCode(events, recordingName) {
    let code = `import { test, expect } from '@playwright/test';

test('${recordingName || "Recorded Test"}', async ({ page }) => {
`;
    events.forEach((event, index) => {
        switch (event.type) {
            case "navigate":
                code += `  // Step ${index + 1}: Navigate to URL\n`;
                code += `  await page.goto('${event.url}');\n\n`;
                break;
            case "click":
                code += `  // Step ${index + 1}: Click element\n`;
                code += `  await page.click('${event.selector}');\n\n`;
                break;
            case "type":
                code += `  // Step ${index + 1}: Type text\n`;
                code += `  await page.fill('${event.selector}', '${event.text}');\n\n`;
                break;
            case "wait":
                code += `  // Step ${index + 1}: Wait\n`;
                code += `  await page.waitForTimeout(${event.ms});\n\n`;
                break;
            case "screenshot":
                code += `  // Step ${index + 1}: Take screenshot\n`;
                code += `  await page.screenshot({ path: 'screenshot-${index}.png' });\n\n`;
                break;
            case "refresh":
                code += `  // Step ${index + 1}: Refresh page\n`;
                code += `  await page.reload();\n\n`;
                break;
        }
    });
    code += `});`;
    logger_1.logger.info(`Generated Playwright code for ${events.length} events`);
    return code;
}
/**
 * Generate TypeScript Page Object Model (POM)
 */
function generatePageObjectModel(events, pageName) {
    const uniqueSelectors = new Set(events.filter((e) => e.selector).map((e) => e.selector));
    let code = `import { Page } from '@playwright/test';

export class ${pageName || "Page"} {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

`;
    let selectorIndex = 1;
    uniqueSelectors.forEach((selector) => {
        const varName = `element${selectorIndex++}`;
        code += `  private ${varName} = '${selector}';\n`;
    });
    code += `
  // Action methods
`;
    events.forEach((event, index) => {
        if (event.type === "click" && event.selector) {
            code += `  async click${index}() {\n`;
            code += `    await this.page.click('${event.selector}');\n`;
            code += `  }\n\n`;
        }
    });
    code += `}`;
    logger_1.logger.info(`Generated Page Object Model for ${pageName}`);
    return code;
}
exports.default = {
    generatePlaywrightCode,
    generatePageObjectModel,
};
//# sourceMappingURL=playwrightGenerator.js.map