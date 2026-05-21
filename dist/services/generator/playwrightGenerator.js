"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePlaywrightCode = generatePlaywrightCode;
exports.generatePageObjectModel = generatePageObjectModel;
const logger_1 = require("../../utils/logger");
const groq_service_1 = __importDefault(require("../ai/groq.service"));
const MAX_ASSERTIONS = 15;
/**
 * Generate Playwright test code from recording events
 */
async function generatePlaywrightCode(events, recordingName) {
    const navigateEvent = events.find((e) => e.type === "navigate");
    const targetUrl = navigateEvent?.url ||
        "https://example.com";
    let code = `
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('${recordingName}', async ({ page }) => {

  

  await page.goto('${targetUrl}');

`;
    events.forEach((event, index) => {
        switch (event.type) {
            case "navigate":
                code += `
  // Step ${index + 1}: Navigate

  await page.goto('${event.url}');

`;
                break;
            case "click":
                code += `
  // Step ${index + 1}: Click element

  await safeClick(
    page,
    '${event.selector}'
  );

`;
                /**
                 * Deterministic route assertions
                 */
                {
                    const selector = event.selector || "";
                    if (selector.includes("About")) {
                        code += `
  await expect(page).toHaveURL(
    /about/
  );

`;
                    }
                    if (selector.includes("Services")) {
                        code += `
  await expect(page).toHaveURL(
    /services/
  );

`;
                    }
                    if (selector.includes("Contact")) {
                        code += `
  await expect(page).toHaveURL(
    /contact/
  );

`;
                    }
                    if (selector.includes("Internship")) {
                        code += `
  await expect(page).toHaveURL(
    /internship/
  );

`;
                    }
                }
                break;
            case "type":
            case "input":
                code += `
  // Step ${index + 1}: Fill input

  await page.fill(
    '${event.selector}',
    '${(event.value || event.text || "")
                    .replace(/'/g, "\\'")}'
  );

`;
                break;
            case "wait":
                code += `
  // Step ${index + 1}: Wait

  await page.waitForTimeout(
    ${event.ms || 1000}
  );

`;
                break;
            case "screenshot":
                code += `
  // Step ${index + 1}: Screenshot

 

`;
                break;
            case "refresh":
                code += `
  // Step ${index + 1}: Refresh

  await page.reload();

`;
                break;
            default:
                break;
        }
    });
    /**
     * AI Assertions
     */
    try {
        const interactionEvents = events.filter((e) => e.type === "click" ||
            e.type === "input" ||
            e.type === "type");
        const aiAssertions = await groq_service_1.default.generateAssertions(interactionEvents);
        console.log("🤖 Raw AI Assertions:\n", aiAssertions);
        const allowedAssertions = [
            "toBeVisible",
            "toBeEnabled",
            "toContainText",
            "toHaveURL",
            "not.toBeVisible",
        ];
        const healedAssertions = aiAssertions
            .split("\n")
            // remove empty
            .filter((line) => line.trim())
            // allowed assertions only
            .filter((line) => allowedAssertions.some((a) => line.includes(a)))
            // remove noisy amazon assertions
            .filter((line) => !line.includes("Amazon") &&
            !line.includes("Cart") &&
            !line.includes("Orders") &&
            !line.includes("Sign in") &&
            !line.includes("Customer Service"))
            // remove duplicate lines
            .filter((line, index, self) => self.indexOf(line) === index)
            // max assertions
            .slice(0, 10)
            .join("\n")
            // healing visible
            .replace(/await expect\(page\.locator\((.*?)\)\)\.toBeVisible\(\);/g, "await safeExpectVisible(page, $1);")
            // healing clicks
            .replace(/await page\.locator\((.*?)\)\.click\(\);/g, "await safeClick(page, $1);");
        const cleanedAssertions = aiAssertions
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            // remove duplicates
            .filter((line, index, self) => self.indexOf(line) === index)
            // only allow expect assertions
            .filter((line) => line.startsWith("await expect"))
            // remove unsupported assertions
            .filter((line) => allowedAssertions.some((a) => line.includes(a)))
            // prevent broken lines
            .filter((line) => !line.includes("undefined") &&
            !line.includes("null") &&
            !line.includes("text\n") &&
            line.length < 250)
            // convert locator to first()
            .map((line) => line.replace(/page\.locator\((.*?)\)/g, "page.locator($1).first()"))
            // self-healing visibility
            .map((line) => line.replace(/await expect\(page\.locator\((.*?)\)\.first\(\)\)\.toBeVisible\(\);/g, "await safeExpectVisible(page, $1);"))
            // limit assertion explosion
            .slice(0, MAX_ASSERTIONS);
        const finalAssertions = cleanedAssertions.join("\n");
        code += `

  // AI Assertions

  ${finalAssertions}

`;
    }
    catch (error) {
        console.log("⚠️ AI assertions skipped", error);
    }
    code += `
});
`;
    logger_1.logger.info(`Generated Playwright code for ${events.length} events`);
    return code;
}
/**
 * Generate TypeScript Page Object Model (POM)
 */
function generatePageObjectModel(events, pageName) {
    const uniqueSelectors = new Set(events
        .filter((e) => e.selector)
        .map((e) => e.selector));
    let code = `
import { Page } from '@playwright/test';

export class ${pageName || "Page"} {

  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

`;
    let selectorIndex = 1;
    uniqueSelectors.forEach((selector) => {
        const varName = `element${selectorIndex++}`;
        code += `
  private ${varName} = '${selector}';
`;
    });
    code += `
  // Action methods
`;
    events.forEach((event, index) => {
        if (event.type === "click" &&
            event.selector) {
            code += `
  async click${index}() {

    await this.page.click(
      '${event.selector}'
    );

  }

`;
        }
        if ((event.type === "type" ||
            event.type === "input") &&
            event.selector) {
            code += `
  async type${index}(value: string) {

    await this.page.fill(
      '${event.selector}',
      value
    );

  }

`;
        }
    });
    code += `

  
`;
    logger_1.logger.info(`Generated Page Object Model for ${pageName || "Page"}`);
    return code;
}
exports.default = {
    generatePlaywrightCode,
    generatePageObjectModel,
};
//# sourceMappingURL=playwrightGenerator.js.map