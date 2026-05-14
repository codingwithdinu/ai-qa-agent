import { RecordingEvent } from "../../types/recording.types";

export function buildSystemPrompt(): string {
	return `You are an expert QA automation engineer. Your task is to generate comprehensive test cases from user interactions. 
Generate clear, executable test steps that can be automated with Playwright.
Each step should be specific and actionable.
Include assertions and validations where appropriate.`;
}

export function buildUserPrompt(events: RecordingEvent[]): string {
	let prompt = "Based on the following user interactions, generate test case code:\n\n";

	events.forEach((event, index) => {
		switch (event.type) {
			case "navigate":
				prompt += `${index + 1}. Navigate to: ${event.url}\n`;
				break;
			case "click":
				prompt += `${index + 1}. Click on element: ${event.selector}\n`;
				break;
			case "type":
				prompt += `${index + 1}. Type "${event.text}" into: ${event.selector}\n`;
				break;
			case "wait":
				prompt += `${index + 1}. Wait for ${event.ms}ms\n`;
				break;
			case "screenshot":
				prompt += `${index + 1}. Take screenshot\n`;
				break;
			case "refresh":
				prompt += `${index + 1}. Refresh the page\n`;
				break;
		}
	});

	prompt += "\nGenerate Playwright test code that replicates these interactions.";
	return prompt;
}

export function buildContextPrompt(context: string): string {
	return `Additional context: ${context}`;
}

export default {
	buildSystemPrompt,
	buildUserPrompt,
	buildContextPrompt,
};
