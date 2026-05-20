"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRecordingUrl = validateRecordingUrl;
exports.validateRecordingEvents = validateRecordingEvents;
exports.validateRecording = validateRecording;
function validateRecordingUrl(url) {
    const errors = [];
    if (!url) {
        errors.push("URL is required");
    }
    else if (!/^https?:\/\/.+/.test(url)) {
        errors.push("Invalid URL format. Must start with http:// or https://");
    }
    return errors;
}
function validateRecordingEvents(events) {
    const errors = [];
    if (!Array.isArray(events)) {
        errors.push("Events must be an array");
    }
    else if (events.length === 0) {
        errors.push("At least one event is required");
    }
    else {
        events.forEach((event, index) => {
            if (!event.type) {
                errors.push(`Event ${index}: type is required`);
            }
            const validTypes = ["navigate", "click", "type", "wait", "screenshot", "refresh"];
            if (!validTypes.includes(event.type)) {
                errors.push(`Event ${index}: invalid type '${event.type}'`);
            }
        });
    }
    return errors;
}
function validateRecording(data) {
    const errors = {};
    const urlErrors = validateRecordingUrl(data.url);
    if (urlErrors.length > 0) {
        errors.url = urlErrors;
    }
    const eventErrors = validateRecordingEvents(data.events || []);
    if (eventErrors.length > 0) {
        errors.events = eventErrors;
    }
    return errors;
}
exports.default = { validateRecordingUrl, validateRecordingEvents, validateRecording };
//# sourceMappingURL=recording.validator.js.map