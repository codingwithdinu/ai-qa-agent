"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFromOpenAI = generateFromOpenAI;
const node_fetch_1 = __importDefault(require("node-fetch"));
const env_1 = require("../../config/env");
async function generateFromOpenAI(prompt, model = "gpt-3.5-turbo") {
    if (!env_1.OPENAI_API_KEY) {
        // Fallback: simple echo mock for local dev
        return `MOCKED_RESPONSE: ${prompt}`;
    }
    const url = "https://api.openai.com/v1/chat/completions";
    const body = {
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
    };
    const res = await (0, node_fetch_1.default)(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env_1.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`OpenAI error: ${res.status} ${txt}`);
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    return content || null;
}
exports.default = { generateFromOpenAI };
//# sourceMappingURL=openai.service.js.map