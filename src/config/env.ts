import dotenv from "dotenv";

dotenv.config();

const get = (key: string, fallback?: string) => {
	const v = process.env[key];

	if (v === undefined) return fallback;

	return v;
};

export const PORT = Number(get("PORT", "5000"));
export const NODE_ENV = get("NODE_ENV", "development");
export const OPENAI_API_KEY = get("OPENAI_API_KEY", "");

export default {
	PORT,
	NODE_ENV,
	OPENAI_API_KEY,
};
