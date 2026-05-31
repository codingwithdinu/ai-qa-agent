"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBestSelector = findBestSelector;
const healingStore_1 = require("./healingStore");
async function findBestSelector(page, failedSelector) {
    const blockedSelectors = [
        "svg",
        "div",
        "span",
        "p",
        "path",
        "section",
        "body",
    ];
    if (blockedSelectors.includes(failedSelector.trim())) {
        return null;
    }
    try {
        /**
         * TEXT SELECTOR
         */
        if (failedSelector.startsWith("text=")) {
            const rawText = failedSelector
                .replace("text=", "")
                .trim();
            /**
             * Try exact text
             */
            const exact = page.locator(`text=${rawText}`);
            if (await exact.count() > 0) {
                return `text=${rawText}`;
            }
            /**
             * Try partial text
             */
            const partial = page.locator(`text=${rawText}`);
            if (await partial.count() > 0) {
                return `text=${rawText.substring(0, 3)}`;
            }
            /**
             * Role-based recovery
             */
            const roleCandidate = page.getByRole("link", {
                name: new RegExp(rawText, "i"),
            });
            if (await roleCandidate.count() > 0) {
                return `role=link[name="${rawText}"]`;
            }
        }
        if (page.isClosed()) {
            return null;
        }
        /**
         * DOM ANALYSIS
         */
        const elements = await page.evaluate(() => {
            const all = Array.from(document.querySelectorAll("*"));
            return all
                .filter((el) => {
                /**
                 * Remove huge containers
                 */
                const text = (el.innerText || "")
                    .trim();
                if (text.length > 120) {
                    return false;
                }
                /**
                 * Remove layout containers
                 */
                const tag = el.tagName?.toLowerCase();
                if ([
                    "body",
                    "html",
                    "main"
                ].includes(tag)) {
                    return false;
                }
                /**
                 * Remove app wrappers
                 */
                if (el.id === "root") {
                    return false;
                }
                const clickable = [
                    "button",
                    "a",
                    "input",
                    "textarea",
                    "select"
                ].includes(tag);
                return clickable;
            })
                .map((el) => ({
                tag: el.tagName?.toLowerCase(),
                id: el.id || "",
                text: el.innerText || "",
                className: typeof el.className === "string"
                    ? el.className
                    : "",
                type: el.type || "",
                placeholder: el.placeholder || "",
                aria: el.getAttribute("aria-label") || "",
                name: el.getAttribute("name") || "",
                testid: el.getAttribute("data-testid") || "",
            }));
        });
        /**
         * KEYWORD EXTRACTION
         */
        let keyword = failedSelector;
        /**
         * role=link[name="About"]
         */
        const roleMatch = failedSelector.match(/name="([^"]+)"/);
        /**
         * input[name="name"] or [data-testid=my-id]
         */
        const attributeMatch = failedSelector.match(/\[[^\]=]+=["']([^"']+)["']\]/) ??
            failedSelector.match(/\[[^\]=]+=([^\]]+)\]/);
        if (roleMatch?.[1]) {
            keyword =
                roleMatch[1];
        }
        else if (attributeMatch?.[1]) {
            keyword =
                attributeMatch[1];
        }
        /**
         * text=About
         */
        else if (failedSelector.startsWith("text=")) {
            keyword =
                failedSelector.replace("text=", "");
        }
        /**
         * #aboutBtn
         */
        else {
            keyword =
                failedSelector
                    .replace("#", "")
                    .replace(".", "")
                    .replace("Btn", "");
        }
        keyword =
            keyword.toLowerCase().trim();
        const scored = [];
        for (const el of elements) {
            let score = 0;
            const id = typeof el.id === "string"
                ? el.id.toLowerCase()
                : "";
            const text = typeof el.text === "string"
                ? el.text.toLowerCase()
                : "";
            const cls = typeof el.className === "string"
                ? el.className.toLowerCase()
                : "";
            const aria = typeof el.aria === "string"
                ? el.aria.toLowerCase()
                : "";
            const placeholder = typeof el.placeholder === "string"
                ? el.placeholder.toLowerCase()
                : "";
            const name = typeof el.name === "string"
                ? el.name.toLowerCase()
                : "";
            const testid = typeof el.testid === "string"
                ? el.testid.toLowerCase()
                : "";
            /**
             * PRIORITY SCORING
             */
            if (testid.includes(keyword))
                score += 20;
            if (id.includes(keyword))
                score += 15;
            if (aria.includes(keyword))
                score += 12;
            if (name.includes(keyword))
                score += 10;
            if (placeholder.includes(keyword))
                score += 8;
            /**
             * EXACT TEXT MATCH
             */
            if (text === keyword) {
                score += 20;
            }
            else if (text.includes(keyword)) {
                score += 6;
            }
            if (cls.includes(keyword))
                score += 4;
            if (el.tag === "button")
                score += 3;
            if (score > 0) {
                let selector = null;
                if (testid) {
                    selector =
                        `[data-testid="${testid}"]`;
                }
                else if (id) {
                    selector =
                        `#${id}`;
                }
                else if (aria) {
                    selector =
                        `[aria-label="${aria}"]`;
                }
                else if (name) {
                    selector =
                        `[name="${name}"]`;
                }
                else if (placeholder) {
                    selector =
                        `[placeholder="${placeholder}"]`;
                }
                else if (text) {
                    selector =
                        `text=${text}`;
                }
                if (selector) {
                    scored.push({
                        selector,
                        score,
                        confidence: Math.min(score * 5, 100),
                        matchedText: text,
                    });
                }
            }
        }
        scored.sort((a, b) => b.score - a.score);
        if (scored.length > 0) {
            const best = scored[0];
            healingStore_1.healingHistory.push({
                originalSelector: failedSelector,
                healedSelector: best.selector,
                confidence: best.confidence,
                timestamp: new Date(),
            });
            return best.selector;
        }
        return null;
    }
    catch (error) {
        return null;
    }
}
//# sourceMappingURL=selectorHealer.js.map