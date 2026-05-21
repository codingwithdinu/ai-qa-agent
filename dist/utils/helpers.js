"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = delay;
exports.generateId = generateId;
exports.sanitizeInput = sanitizeInput;
exports.parseJSON = parseJSON;
exports.redactSecrets = redactSecrets;
exports.isEmpty = isEmpty;
exports.asyncEventEmitter = asyncEventEmitter;
const events_1 = require("events");
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}
function sanitizeInput(input) {
    return input.replace(/[<>\"']/g, "");
}
function parseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    }
    catch (error) {
        return null;
    }
}
function redactSecrets(obj) {
    if (typeof obj !== "object" || obj === null)
        return obj;
    const secrets = ["password", "token", "secret", "apiKey", "key"];
    const redacted = JSON.parse(JSON.stringify(obj));
    function traverse(current) {
        for (const key in current) {
            if (secrets.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
                current[key] = "***REDACTED***";
            }
            else if (typeof current[key] === "object") {
                traverse(current[key]);
            }
        }
    }
    traverse(redacted);
    return redacted;
}
function isEmpty(value) {
    return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}
function asyncEventEmitter() {
    return new events_1.EventEmitter();
}
exports.default = {
    delay,
    generateId,
    sanitizeInput,
    parseJSON,
    redactSecrets,
    isEmpty,
    asyncEventEmitter,
};
//# sourceMappingURL=helpers.js.map