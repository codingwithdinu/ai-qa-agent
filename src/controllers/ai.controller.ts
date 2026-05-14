import { Request, Response } from "express";
import OpenAIService from "../services/ai/openai.service";

export async function generate(req: Request, res: Response) {
	try {
		const { prompt } = req.body;

		if (!prompt) return res.status(400).json({ success: false, message: "Missing prompt" });

		const result = await OpenAIService.generateFromOpenAI(prompt);

		return res.status(200).json({ success: true, data: result });
	} catch (err: any) {
		console.error("AI generate error", err);
		return res.status(500).json({ success: false, message: err.message || "Internal error" });
	}
}

export default { generate };
