import fetch from "node-fetch";
import { OPENAI_API_KEY } from "../../config/env";

export async function generateFromOpenAI(prompt: string, model = "gpt-3.5-turbo") {
	if (!OPENAI_API_KEY) {
		// Fallback: simple echo mock for local dev
		return `MOCKED_RESPONSE: ${prompt}`;
	}

	const url = "https://api.openai.com/v1/chat/completions";

	const body = {
		model,
		messages: [{ role: "user", content: prompt }],
		max_tokens: 800,
	};

	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${OPENAI_API_KEY}`,
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

export default { generateFromOpenAI };
