"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playwrightTestTemplate = playwrightTestTemplate;
exports.pageObjectModelTemplate = pageObjectModelTemplate;
function playwrightTestTemplate(recordingName, events) {
    let testCode = `import { test, expect } from '@playwright/test';

test.describe('${recordingName}', () => {
  test('should execute recorded steps', async ({ page }) => {
`;
    events.forEach((event, index) => {
        testCode += `    // Step ${index + 1}: ${event.type}\n`;
        switch (event.type) {
            case "navigate":
                testCode += `    await page.goto('${event.url}');\n`;
                break;
            case "click":
                testCode += `    await page.click('${event.selector}');\n`;
                break;
            case "type":
                testCode += `    await page.fill('${event.selector}', '${event.text}');\n`;
                break;
            case "wait":
                testCode += `    await page.waitForTimeout(${event.ms || 1000});\n`;
                break;
            case "screenshot":
                testCode += `    await page.screenshot({ path: 'step-${index + 1}.png' });\n`;
                break;
        }
        testCode += "\n";
    });
    testCode += `  });
});`;
    return testCode;
}
function pageObjectModelTemplate(pageName, selectors) {
    let code = `import { Page } from '@playwright/test';

export class ${pageName} {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Selectors
`;
    for (const [name, selector] of Object.entries(selectors)) {
        code += `  private ${name} = '${selector}';\n`;
    }
    code += `
  // Action methods
  async visit(url: string) {
    await this.page.goto(url);
  }

  async close() {
    await this.page.close();
  }
}

export default ${pageName};`;
    return code;
}
exports.default = {
    playwrightTestTemplate,
    pageObjectModelTemplate,
};
//# sourceMappingURL=playwright.template.js.map