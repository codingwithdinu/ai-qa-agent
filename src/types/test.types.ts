export interface TestStep {
	index: number;
	action: string;
	selector?: string;
	text?: string;
	url?: string;
	assertion?: string;
	timeout?: number;
}

export interface TestCase {
	id: string;
	name: string;
	steps: TestStep[];
	expectedResult?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface TestResult {
	id: string;
	testId: string;
	success: boolean;
	duration: number;
	steps: any[];
	error?: string;
}
