import { logger } from "../../utils/logger";
import prisma from "../../config/database";
import { RecordingEvent } from "../../types/recording.types";

/**
 * Generate AI-powered test cases from recorded events
 */
export async function generateAITestCases(recordingId: string, context?: string): Promise<string> {
	try {
		const recording = await prisma.recording.findUnique({ where: { id: recordingId } });

		if (!recording) {
			throw new Error("Recording not found");
		}

		const events =
			(
				Array.isArray(recording.events)
					? recording.events
					: []
			) as unknown as RecordingEvent[];


		let prompt = `Generate comprehensive test cases for the following user interactions:\n\n`;

		events.forEach((event, index) => {
			prompt += `Step ${index + 1}: ${event.type}`;
			if (event.selector) prompt += ` - Selector: ${event.selector}`;
			if (event.text) prompt += ` - Text: ${event.text}`;
			if (event.url) prompt += ` - URL: ${event.url}`;
			prompt += "\n";
		});

		if (context) {
			prompt += `\nAdditional context: ${context}`;
		}

		logger.info(`Generated AI test cases prompt for recording ${recordingId}`);

		// In production, call OpenAI API
		return `# Generated Test Cases\n${prompt}`;
	} catch (error: any) {
		logger.error("AI test case generation error", error);
		throw error;
	}
}

/**
 * Analyze recording for best test strategies
 */
export async function analyzeRecordingForStrategy(recordingId: string): Promise<any> {
	try {
		const recording = await prisma.recording.findUnique({ where: { id: recordingId } });

		if (!recording) {
			throw new Error("Recording not found");
		}

		const events =
			(
				Array.isArray(recording.events)
					? recording.events
					: []
			) as unknown as RecordingEvent[];


		const analysis = {
			totalSteps: events.length,
			hasNavigation: events.some((e) => e.type === "navigate"),
			hasFormInteraction: events.some((e) => e.type === "type"),
			hasClicks: events.some((e) => e.type === "click"),
			suggestedStrategy: "BDD" as const,
		};

		logger.info(`Analyzed recording ${recordingId}`, analysis);

		return analysis;
	} catch (error: any) {
		logger.error("Recording analysis error", error);
		throw error;
	}
}

export default {
	generateAITestCases,
	analyzeRecordingForStrategy,
};
