"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateValidationCode = generateValidationCode;
exports.generateAssertionHelpers = generateAssertionHelpers;
const logger_1 = require("../../utils/logger");
/**
 * Generate validation/assertion code from events
 */
function generateValidationCode(events) {
    let validationCode = `export const validations = {\n`;
    events.forEach((event, index) => {
        validationCode += `  step${index}: async (page) => {\n`;
        if (event.type === "navigate") {
            validationCode += `    expect(page.url()).toContain('${event.url}');\n`;
        }
        else if (event.type === "click") {
            validationCode += `    const element = await page.$('${event.selector}');\n`;
            validationCode += `    expect(element).toBeTruthy();\n`;
        }
        else if (event.type === "type") {
            validationCode += `    const value = await page.inputValue('${event.selector}');\n`;
            validationCode += `    expect(value).toBe('${event.text}');\n`;
        }
        validationCode += `  },\n`;
    });
    validationCode += `};`;
    logger_1.logger.info(`Generated validation code for ${events.length} events`);
    return validationCode;
}
/**
 * Generate assertion helper functions
 */
function generateAssertionHelpers() {
    return `export const assertions = {
  async elementVisible(page, selector) {
    const element = await page.$(selector);
    return element !== null;
  },

  async elementContainsText(page, selector, text) {
    const content = await page.textContent(selector);
    return content?.includes(text);
  },

  async urlContains(page, url) {
    return page.url().includes(url);
  },

  async pageTitle(page) {
    return page.title();
  },
};`;
}
exports.default = {
    generateValidationCode,
    generateAssertionHelpers,
};
//# sourceMappingURL=validationGenerator.js.map