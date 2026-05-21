"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
exports.sanitizeInput = sanitizeInput;
const logger_1 = require("../utils/logger");
function validateRequest(schema) {
    return (req, res, next) => {
        try {
            const data = req.body;
            const errors = [];
            for (const [field, rules] of Object.entries(schema)) {
                const value = data[field];
                // Check if field is required
                if (rules.required && (value === undefined || value === null || value === "")) {
                    errors.push(`Field '${field}' is required`);
                    continue;
                }
                if (value === undefined || value === null) {
                    continue;
                }
                // Check type
                const actualType = Array.isArray(value) ? "array" : typeof value;
                if (actualType !== rules.type) {
                    errors.push(`Field '${field}' must be of type ${rules.type}, got ${actualType}`);
                }
                // Check string patterns
                if (rules.type === "string" && typeof value === "string") {
                    if (rules.minLength && value.length < rules.minLength) {
                        errors.push(`Field '${field}' must be at least ${rules.minLength} characters`);
                    }
                    if (rules.maxLength && value.length > rules.maxLength) {
                        errors.push(`Field '${field}' must be at most ${rules.maxLength} characters`);
                    }
                    if (rules.pattern && !rules.pattern.test(value)) {
                        errors.push(`Field '${field}' does not match required pattern`);
                    }
                }
            }
            if (errors.length > 0) {
                logger_1.logger.warn(`Validation failed for ${req.path}`, { errors });
                return res.status(400).json({ error: "Validation failed", details: errors });
            }
            next();
        }
        catch (error) {
            logger_1.logger.error("Validation middleware error", error);
            res.status(500).json({ error: "Validation error" });
        }
    };
}
function sanitizeInput(req, res, next) {
    const sanitize = (obj) => {
        if (typeof obj === "string") {
            return obj.replace(/[<>\"']/g, "");
        }
        else if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        else if (typeof obj === "object" && obj !== null) {
            const sanitized = {};
            for (const key in obj) {
                sanitized[key] = sanitize(obj[key]);
            }
            return sanitized;
        }
        return obj;
    };
    req.body = sanitize(req.body);
    next();
}
exports.default = { validateRequest, sanitizeInput };
//# sourceMappingURL=validation.middleware.js.map