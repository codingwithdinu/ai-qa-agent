import { Request, Response } from "express";
import { buildMarkdownReport } from "../templates/markdown.template";
import prisma from "../config/database";

export async function generateMarkdown(_req: Request, res: Response) {
	const title = "AI QA Report";

	const recs = await prisma.recording.findMany({});

	const content = recs.map((r: any) => {
		const events = JSON.parse(r.events || "[]") as any[];
		return `- Recording ${r.id} (${events.length} events)`;
	}).join("\n");

	const md = buildMarkdownReport(title, content);

	return res.status(200).json({ success: true, data: md });
}

export default { generateMarkdown };
