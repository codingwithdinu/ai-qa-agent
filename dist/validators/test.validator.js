"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRecordingId = validateRecordingId;
exports.validateTestSteps = validateTestSteps;
exports.validateTest = validateTest;
function validateRecordingId(recordingId) {
    const errors = [];
    if (!recordingId) {
        errors.push("Recording ID is required");
    }
    else if (recordingId.length < 3) {
        errors.push("Recording ID must be at least 3 characters");
    }
    return errors;
}
function validateTestSteps(steps) {
    const errors = [];
    if (!Array.isArray(steps)) {
        errors.push("Steps must be an array");
    }
    else if (steps.length === 0) {
        errors.push("At least one test step is required");
    }
    return errors;
}
function validateTest(data) {
    const errors = {};
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
exports.default = { validateRecordingId, validateTestSteps, validateTest };
//# sourceMappingURL=test.validator.js.map