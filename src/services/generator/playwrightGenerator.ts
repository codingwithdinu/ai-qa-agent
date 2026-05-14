import { logger } from "../../utils/logger";
import { RecordingEvent } from "../../types/recording.types";
import GroqService from "../ai/groq.service";

/**
 * Generate Playwright test code from recording events
 */
export async function generatePlaywrightCode(
  events: RecordingEvent[],
  recordingName?: string,
): Promise<string> {

  let code = `
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('${recordingName || "Recorded Test"}', async ({ page }) => {

  await page.goto('http://localhost:5000/test.html');

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

        break;

      case "type":

        code += `
  // Step ${index + 1}: Type text

  await page.fill(
    '${event.selector}',
    '${event.text || ""}'
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

  await page.screenshot({
    path: 'screenshot-${index}.png'
  });

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

    const aiAssertions =
      await GroqService.generateAssertions(
        events
      );

    const healedAssertions =
      aiAssertions

        // heal visibility assertions
        .replace(
          /await expect\(page\.locator\((.*?)\)\)\.toBeVisible\(\);/g,
          "await safeExpectVisible(page, $1);"
        )

        // heal clicks
        .replace(
          /await page\.locator\((.*?)\)\.click\(\);/g,
          "await safeClick(page, $1);"
        );

    code += `

  // AI Assertions

  ${healedAssertions}

`;

  } catch (error) {

    console.log(
      "⚠️ AI assertions skipped",
      error
    );

  }

  code += `
});
`;

  logger.info(
    `Generated Playwright code for ${events.length} events`
  );

  return code;
}

/**
 * Generate TypeScript Page Object Model (POM)
 */
export function generatePageObjectModel(
  events: RecordingEvent[],
  pageName?: string,
): string {

  const uniqueSelectors = new Set(
    events
      .filter((e) => e.selector)
      .map((e) => e.selector),
  );

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

    const varName =
      `element${selectorIndex++}`;

    code += `
  private ${varName} = '${selector}';
`;

  });

  code += `
  // Action methods
`;

  events.forEach((event, index) => {

    if (
      event.type === "click" &&
      event.selector
    ) {

      code += `
  async click${index}() {

    await this.page.click(
      '${event.selector}'
    );

  }

`;

    }

    if (
      event.type === "type" &&
      event.selector
    ) {

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
}
`;

  logger.info(
    `Generated Page Object Model for ${pageName || "Page"}`
  );

  return code;
}

export default {
  generatePlaywrightCode,
  generatePageObjectModel,
};