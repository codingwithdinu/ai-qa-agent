import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,

  baseURL: "https://api.groq.com/openai/v1",
});

export async function generateAssertions(events: any[]): Promise<string> {
  const prompt = `
You are an expert QA automation engineer.

Generate Playwright assertions
for these browser events.

Events:
${JSON.stringify(events, null, 2)}

Return ONLY Playwright code.
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

export async function generateText(
  prompt: string
): Promise<string> {

  const response =
    await client.chat.completions.create({

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

export default {
  generateAssertions,
  generateText,
};