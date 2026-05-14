import { logger } from "../../utils/logger";
import prisma from "../../config/database";

/**
 * Generate test case file from recording
 */
export async function generateTestCaseFile(recordingId: string, format: "typescript" | "javascript" = "typescript"): Promise<string> {
	try {
		const recording = await prisma.recording.findUnique({ where: { id: recordingId } });

		if (!recording) {
			throw new Error("Recording not found");
		}

		const events = JSON.parse(recording.events) as any[];

		let testCode = "";

		if (format === "typescript") {
			testCode = `import { test, expect } from '@playwright/test';

test.describe('Test Suite', () => {
  test('should execute recorded steps', async ({ page }) => {
`;
		} else {
			testCode = `const { test, expect } = require('@playwright/test');

test.describe('Test Suite', () => {
  test('should execute recorded steps', async ({ page }) => {
`;
		}

		events.forEach((event: any, index: number) => {
			testCode += generateStepCode(event, index, format);
		});

		testCode += `  });
});`;

		logger.info(`Generated test case file for recording ${recordingId}`);

		return testCode;
	} catch (error: any) {
		logger.error("Test case file generation error", error);
		throw error;
	}
}

function generateStepCode(event: any, index: number, format: string): string {
	let code = `    // Step ${index + 1}\n`;

	switch (event.type) {
		case "navigate":
			code += `    await page.goto('${event.url}');\n`;
			break;
		case "click":
			code += `    await page.click('${event.selector}');\n`;
			break;
		case "type":
			code += `    await page.fill('${event.selector}', '${event.text}');\n`;
			break;
		case "wait":
			code += `    await page.waitForTimeout(${event.ms});\n`;
			break;
		case "screenshot":
			code += `    await page.screenshot({ path: 'step-${index}.png' });\n`;
			break;
		case "refresh":
			code += `    await page.reload();\n`;
			break;
	}

	code += "\n";
	return code;
}

/**
 * Validate generated test code
 */
export async function validateTestCode(code: string): Promise<boolean> {
	try {
		// Basic syntax check
		if (!code.includes("test") && !code.includes("describe")) {
			logger.warn("Generated code missing test framework keywords");
			return false;
		}

		logger.info("Test code validation passed");
		return true;
	} catch (error: any) {
		logger.error("Test code validation error", error);
		return false;
	}
}

export default {
	generateTestCaseFile,
	validateTestCode,
};
