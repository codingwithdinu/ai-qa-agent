"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssertions = generateAssertions;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});
async function generateAssertions(events) {
    const prompt = `
You are an expert QA automation engineer.

Generate Playwright assertions
for these browser events.

Events:
${JSON.stringify(events, null, 2)}

Return only Playwright code.
`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;
}
exports.default = {
    generateAssertions,
};
//# sourceMappingURL=gemini.service.js.map