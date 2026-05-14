export interface AIResponse {
	message: string;
	code?: string;
	isSuccessful: boolean;
	timestamp: Date;
}

export interface AIPrompt {
	role: "system" | "user" | "assistant";
	content: string;
}

export interface AIRequest {
	recordingId: string;
	events: any[];
	context?: string;
}

export type AIProvider = "openai" | "claude" | "mock";
