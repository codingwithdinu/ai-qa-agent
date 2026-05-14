"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMarkdownReport = generateMarkdownReport;
const logger_1 = require("../../utils/logger");
/**
 * Generate Markdown report
 */
function generateMarkdownReport(data) {
    const { testRunId, recordingId, metrics, steps } = data;
    let markdown = `# Test Execution Report

**Test Run ID:** ${testRunId}  
**Recording ID:** ${recordingId}  
**Generated:** ${new Date().toISOString()}

## Summary

| Metric | Value |
|--------|-------|
| Total Steps | ${metrics.totalSteps} |
| Passed | ${metrics.passedSteps} |
| Failed | ${metrics.failedSteps} |
| Success Rate | ${metrics.successRate}% |
| Duration | ${metrics.duration}ms |

## Details

### Steps

`;
    steps.forEach((step) => {
        const status = step.success ? "✅" : "❌";
        markdown += `${status} **Step ${step.index}:** ${step.action}\n`;
        if (step.error) {
            markdown += `\n> Error: ${step.error}\n\n`;
        }
    });
    markdown += `

## Conclusion

${metrics.successRate >= 80 ? "✅ Test execution was successful!" : "❌ Test execution had failures. Please review the steps above."}
`;
    logger_1.logger.info(`Generated Markdown report for test run ${testRunId}`);
    return markdown;
}
exports.default = { generateMarkdownReport };
//# sourceMappingURL=markdownReport.service.js.map