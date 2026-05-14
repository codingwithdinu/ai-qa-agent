export interface ReportMetrics {
	totalSteps: number;
	passedSteps: number;
	failedSteps: number;
	duration: number;
	successRate: number;
	timestamp: Date;
}

export interface ReportData {
	testRunId: string;
	recordingId: string;
	metrics: ReportMetrics;
	steps: any[];
	screenshots?: string[];
	summary: string;
}

export type ReportFormat = "markdown" | "html" | "json" | "pdf";
