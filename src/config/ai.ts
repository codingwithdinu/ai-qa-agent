export const AI_CONFIG = {
	provider: process.env.AI_PROVIDER || "openai",
	apiKey: process.env.OPENAI_API_KEY,
	model: process.env.AI_MODEL || "gpt-3.5-turbo",
	maxTokens: parseInt(process.env.AI_MAX_TOKENS || "2048"),
	temperature: parseFloat(process.env.AI_TEMPERATURE || "0.7"),
	timeout: parseInt(process.env.AI_TIMEOUT || "30000"),
};

export default AI_CONFIG;
