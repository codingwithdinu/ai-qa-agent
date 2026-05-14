import { expect, Page } from "@playwright/test";
import { findBestSelector }
    from "../services/healing/selectorHealer";

export async function safeClick(
    page: Page,
    selector: string
): Promise<string> {

    try {

        await page.click(selector, {
            timeout: 2000,
        });

        return selector;

    } catch (error) {

        console.log(
            "⚠️ Selector failed:",
            selector
        );

        const healedSelector =
            await findBestSelector(
                page,
                selector
            );

        if (healedSelector) {

            await page.click(
                healedSelector,
                {
                    timeout: 2000,
                }
            );

            console.log(
                "🤖 AI healed selector:",
                healedSelector
            );

            return healedSelector;

        }

        throw new Error(
            `Self-healing failed for selector: ${selector}`
        );

    }
}



export async function safeExpectVisible(
    page: Page,
    selector: string
): Promise<string> {

    try {

        await expect(
            page.locator(selector)
        ).toBeVisible({
            timeout: 2000,
        });

        return selector;

    } catch (error) {

        console.log(
            "⚠️ Assertion selector failed:",
            selector
        );

        const healedSelector =
            await findBestSelector(
                page,
                selector
            );

        if (healedSelector) {

            await expect(
                page.locator(healedSelector)
            ).toBeVisible({
                timeout: 2000,
            });

            console.log(
                "🤖 AI healed assertion:",
                healedSelector
            );

            return healedSelector;

        }

        throw new Error(
            `Assertion healing failed for selector: ${selector}`
        );

    }
}