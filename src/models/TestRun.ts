export interface StepResult {
	index: number;
	action: string;
	success: boolean;
	error?: string;
}

export interface TestRun {
	id: string;
	recordingId: string;
	startedAt: string;
	finishedAt?: string;
	success: boolean;
	steps: StepResult[];
}

export const TestRuns: TestRun[] = [];

export default { TestRuns };
