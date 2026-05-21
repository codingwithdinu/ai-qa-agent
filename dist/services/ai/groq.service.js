"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssertions = generateAssertions;
exports.generateText = generateText;
const openai_1 = __importDefault(require("openai"));
const client = new openai_1.default({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});
async function generateAssertions(events) {
    const prompt = `

You are an enterprise QA automation AI.

Your ONLY job is to generate Playwright assertion statements.

STRICT OUTPUT RULES:

- Generate ONLY assertion lines
- DO NOT generate imports
- DO NOT generate require()
- DO NOT generate test()
- DO NOT generate describe()
- DO NOT generate page.goto()
- DO NOT generate browser setup
- DO NOT generate markdown
- DO NOT generate explanations
- DO NOT generate code fences
- DO NOT generate comments
- DO NOT generate URL assertions
- DO NOT use toHaveURL()
DO NOT generate assertions for:
- generic text like Amazon
- Sign in
- Cart
- Orders
- hidden elements
- dropdown options
- repeated content
- footer content
- navigation menus unless explicitly clicked

ONLY generate assertions for:
- interacted elements
- typed inputs
- buttons clicked by user
- final visible state

Generate ONLY interaction-based assertions.

DO NOT generate:
- homepage assertions
- footer assertions
- menu assertions
- hidden elements
- repeated content
- ecommerce recommendations
- dropdown options
- generic branding text

Generate assertions ONLY for:
- clicked elements
- forms
- inputs
- buttons
- navigation outcomes

DO NOT invent values, forms, fields, or flows.

Generate assertions ONLY from the provided interaction events.

ALLOWED OUTPUT EXAMPLES:

await expect(
  page.locator('h1')
).toBeVisible();

await expect(
  page.locator('text=About')
).toBeVisible();

await expect(page).toHaveURL(
  'https://example.com'
);

FORBIDDEN OUTPUT:

import { test } from '@playwright/test';

test('example', async ({ page }) => {

});

Events:
${JSON.stringify(events, null, 2)}

Generate ONLY pure assertion statements.

`;
    const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.2,
    });
    const raw = response.choices[0].message.content || "";
    const cleaned = raw
        .replace(/```javascript/g, "")
        .replace(/```typescript/g, "")
        .replace(/```ts/g, "")
        .replace(/```/g, "")
        .trim();
    return cleaned;
}
async function generateText(prompt) {
    const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.2,
    });
    return response.choices[0]
        .message.content || "";
}
exports.default = {
    generateAssertions,
    generateText,
};
//# sourceMappingURL=groq.service.js.map