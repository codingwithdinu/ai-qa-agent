export interface TestValidation {
	recordingId?: string[];
	steps?: string[];
}

export function validateRecordingId(recordingId: string): string[] {
	const errors: string[] = [];

	if (!recordingId) {
		errors.push("Recording ID is required");
	} else if (recordingId.length < 3) {
		errors.push("Recording ID must be at least 3 characters");
	}

	return errors;
}

export function validateTestSteps(steps: any[]): string[] {
	const errors: string[] = [];

	if (!Array.isArray(steps)) {
		errors.push("Steps must be an array");
	} else if (steps.length === 0) {
		errors.push("At least one test step is required");
	}

	return errors;
}

export function validateTest(data: any): TestValidation {
	const errors: TestValidation = {};

	const recordingIdErrors = validateRecordingId(data.recordingId);
	if (recordingIdErrors.length > 0) {
		errors.recordingId = recordingIdErrors;
	}

	if (data.steps) {
		const stepsErrors = validateTestSteps(data.steps);
		if (stepsErrors.length > 0) {
			errors.steps = stepsErrors;
		}
	}

	return errors;
}

export default { validateRecordingId, validateTestSteps, validateTest };
