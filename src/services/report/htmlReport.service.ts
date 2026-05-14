import { logger } from "../../utils/logger";

/**
 * Generate HTML report
 */
export function generateHTMLReport(data: any): string {
	const { testRunId, recordingId, metrics, steps } = data;

	const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Report - ${testRunId}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    .summary { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .metric { display: inline-block; margin-right: 30px; }
    .metric-value { font-size: 24px; font-weight: bold; color: #0066cc; }
    .metric-label { color: #666; }
    .steps { margin-top: 20px; }
    .step { border-left: 4px solid #0066cc; padding: 10px; margin: 10px 0; background: #f9f9f9; }
    .step.failed { border-left-color: #cc0000; }
    .step.passed { border-left-color: #00cc00; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #0066cc; color: white; }
  </style>
</head>
<body>
  <h1>Test Execution Report</h1>
  
  <div class="summary">
    <h2>Summary</h2>
    <div class="metric">
      <div class="metric-value">${metrics.totalSteps}</div>
      <div class="metric-label">Total Steps</div>
    </div>
    <div class="metric">
      <div class="metric-value">${metrics.passedSteps}</div>
      <div class="metric-label">Passed</div>
    </div>
    <div class="metric">
      <div class="metric-value">${metrics.failedSteps}</div>
      <div class="metric-label">Failed</div>
    </div>
    <div class="metric">
      <div class="metric-value">${metrics.successRate}%</div>
      <div class="metric-label">Success Rate</div>
    </div>
  </div>

  <div class="steps">
    <h2>Steps</h2>
    ${steps
		.map(
			(step: any) => `
      <div class="step ${step.success ? "passed" : "failed"}">
        <strong>Step ${step.index}: ${step.action}</strong>
        ${step.error ? `<p>Error: ${step.error}</p>` : ""}
      </div>
    `
		)
		.join("")}
  </div>

  <p>Generated: ${new Date().toISOString()}</p>
</body>
</html>
  `;

	logger.info(`Generated HTML report for test run ${testRunId}`);

	return html;
}

export default { generateHTMLReport };
