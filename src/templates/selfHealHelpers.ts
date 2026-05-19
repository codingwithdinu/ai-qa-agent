import { expect, Page } from "@playwright/test";
import { findBestSelector }
    from "../services/healing/selectorHealer";
    

export async function safeClick(
    page: Page,
    selector: string
): Promise<string> {

    try {

        await page.waitForSelector(
            selector,
            {
                timeout: 3000,
                state: "attached",
            }
        );

        const locator =
            page.locator(selector)
                .first();

        await locator
            .scrollIntoViewIfNeeded();

        await locator.click({
            timeout: 3000,
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

            await page.waitForSelector(
                healedSelector,
                {
                    timeout: 3000,
                    state: "attached",
                }
            );

            const healedLocator =
                page.locator(
                    healedSelector
                ).first();

            await healedLocator
                .scrollIntoViewIfNeeded();

            await healedLocator.click({
                timeout: 3000,
            });
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

        const locator =
            page.locator(
                selector
            ).first();

        await expect(
            locator
        ).toBeVisible({
            timeout: 3000,
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

            const healedLocator =
                page.locator(
                    healedSelector
                ).first();

            await expect(
                healedLocator
            ).toBeVisible({
                timeout: 3000,
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