"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAITestCases = generateAITestCases;
exports.analyzeRecordingForStrategy = analyzeRecordingForStrategy;
const logger_1 = require("../../utils/logger");
const database_1 = __importDefault(require("../../config/database"));
/**
 * Generate AI-powered test cases from recorded events
 */
async function generateAITestCases(recordingId, context) {
    try {
        const recording = await database_1.default.recording.findUnique({ where: { id: recordingId } });
        if (!recording) {
            throw new Error("Recording not found");
        }
        const events = (Array.isArray(recording.events)
            ? recording.events
            : []);
        let prompt = `Generate comprehensive test cases for the following user interactions:\n\n`;
        events.forEach((event, index) => {
            prompt += `Step ${index + 1}: ${event.type}`;
            if (event.selector)
                prompt += ` - Selector: ${event.selector}`;
            if (event.text)
                prompt += ` - Text: ${event.text}`;
            if (event.url)
                prompt += ` - URL: ${event.url}`;
            prompt += "\n";
        });
        if (context) {
            prompt += `\nAdditional context: ${context}`;
        }
        logger_1.logger.info(`Generated AI test cases prompt for recording ${recordingId}`);
        // In production, call OpenAI API
        return `# Generated Test Cases\n${prompt}`;
    }
    catch (error) {
        logger_1.logger.error("AI test case generation error", error);
        throw error;
    }
}
/**
 * Analyze recording for best test strategies
 */
async function analyzeRecordingForStrategy(recordingId) {
    try {
        const recording = await database_1.default.recording.findUnique({ where: { id: recordingId } });
        if (!recording) {
            throw new Error("Recording not found");
        }
        const events = (Array.isArray(recording.events)
            ? recording.events
            : []);
        const analysis = {
            totalSteps: events.length,
            hasNavigation: events.some((e) => e.type === "navigate"),
            hasFormInteraction: events.some((e) => e.type === "type"),
            hasClicks: events.some((e) => e.type === "click"),
            suggestedStrategy: "BDD",
        };
        logger_1.logger.info(`Analyzed recording ${recordingId}`, analysis);
        return analysis;
    }
    catch (error) {
        logger_1.logger.error("Recording analysis error", error);
        throw error;
    }
}
exports.default = {
    generateAITestCases,
    analyzeRecordingForStrategy,
};
//# sourceMappingURL=aiCaseGenerator.js.map