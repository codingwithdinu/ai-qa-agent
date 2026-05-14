import { GoogleGenerativeAI }
  from "@google/generative-ai";

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY || ""
  );

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export async function generateAssertions(
  events: any[]
): Promise<string> {

  const prompt = `
You are an expert QA automation engineer.

Generate Playwright assertions
for these browser events.

Events:
${JSON.stringify(events, null, 2)}

Return only Playwright code.
`;

  const result =
    await model.generateContent(prompt);

  const response =
    result.response.text();

  return response;
}

export default {
  generateAssertions,
};