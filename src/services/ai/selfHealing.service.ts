import { logger } from "../../utils/logger";
import GroqService from "./groq.service";

export interface SelfHealingResult {
  isSelfHealing: boolean;
  suggestion?: string;
  code?: string;
}

/**
 * Analyze test failure and suggest self-healing strategies
 */
export async function analyzeTestFailure(
  error: string,
  stepData: any,
): Promise<SelfHealingResult> {
  try {
    logger.info("Analyzing test failure for self-healing", {
      error,
      step: stepData,
    });

    // Common failure patterns and suggestions
    if (error.includes("not found") || error.includes("timeout")) {
      return {
        isSelfHealing: true,
        suggestion: "Use more flexible selectors or add retry logic",
        code: `await page.waitForSelector('${stepData.selector}', { timeout: 5000 });`,
      };
    }

    if (error.includes("stale")) {
      return {
        isSelfHealing: true,
        suggestion: "Element became stale, re-fetching...",
        code: `await page.reload(); await page.click('${stepData.selector}');`,
      };
    }

    if (error.includes("navigation")) {
      return {
        isSelfHealing: true,
        suggestion: "Wait for navigation to complete",
        code: `await Promise.all([page.waitForNavigation(), page.click('${stepData.selector}')]);`,
      };
    }

    const aiPrompt = `
A Playwright test failed.

Error:
${error}

Selector:
${stepData.selector || "unknown"}

Action:
${stepData.type || "unknown"}

Suggest:
1. Better Playwright selector
2. Recovery strategy

Return ONLY valid selector.
`;

    try {
      const healedSelector = await GroqService.generateText(aiPrompt);

      return {
        isSelfHealing: true,

        suggestion: "AI-generated selector recovery",

        code: healedSelector.trim(),
      };
    } catch {
      return {
        isSelfHealing: false,
        suggestion: "Manual intervention required",
      };
    }
  } catch (error: any) {
    logger.error("Self-healing analysis error", error);
    return {
      isSelfHealing: false,
      suggestion: "Analysis failed",
    };
  }
}

/**
 * Apply self-healing suggestions to recover from failures
 */
export async function applySelfHealing(
  page: any,
  suggestion: string,
  stepData: any,
): Promise<boolean> {
  try {
    if (suggestion.includes("AI-generated")) {
      try {
        await page.click(stepData.selector);

        return true;
      } catch {
        return false;
      }
    }

    if (suggestion.includes("reload")) {
      // Reload and try again
      await page.reload();
      return true;
    }

    if (suggestion.includes("navigation")) {
      // Wait for navigation
      await page.waitForNavigation();
      return true;
    }

    return false;
  } catch (error: any) {
    logger.error("Self-healing application error", error);
    return false;
  }
}

export default { analyzeTestFailure, applySelfHealing };
