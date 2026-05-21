"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeClick = safeClick;
exports.safeExpectVisible = safeExpectVisible;
const test_1 = require("@playwright/test");
const selectorHealer_1 = require("../services/healing/selectorHealer");
async function safeClick(page, selector) {
    try {
        await page.waitForSelector(selector, {
            timeout: 3000,
            state: "attached",
        });
        const locator = page.locator(selector)
            .first();
        await locator
            .scrollIntoViewIfNeeded();
        await locator.click({
            timeout: 3000,
        });
        return selector;
    }
    catch (error) {
        console.log("⚠️ Selector failed:", selector);
        const healedSelector = await (0, selectorHealer_1.findBestSelector)(page, selector);
        if (healedSelector) {
            await page.waitForSelector(healedSelector, {
                timeout: 3000,
                state: "attached",
            });
            const healedLocator = page.locator(healedSelector).first();
            await healedLocator
                .scrollIntoViewIfNeeded();
            await healedLocator.click({
                timeout: 3000,
            });
            console.log("🤖 AI healed selector:", healedSelector);
            return healedSelector;
        }
        throw new Error(`Self-healing failed for selector: ${selector}`);
    }
}
async function safeExpectVisible(page, selector) {
    try {
        const locator = page.locator(selector).first();
        await (0, test_1.expect)(locator).toBeVisible({
            timeout: 3000,
        });
        return selector;
    }
    catch (error) {
        console.log("⚠️ Assertion selector failed:", selector);
        const healedSelector = await (0, selectorHealer_1.findBestSelector)(page, selector);
        if (healedSelector) {
            const healedLocator = page.locator(healedSelector).first();
            await (0, test_1.expect)(healedLocator).toBeVisible({
                timeout: 3000,
            });
            console.log("🤖 AI healed assertion:", healedSelector);
            return healedSelector;
        }
        throw new Error(`Assertion healing failed for selector: ${selector}`);
    }
}
//# sourceMappingURL=selfHealHelpers.js.map