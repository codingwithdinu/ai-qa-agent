import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export interface ValidationSchema {
	[key: string]: {
		type: "string" | "number" | "boolean" | "array" | "object";
		required?: boolean;
		pattern?: RegExp;
		minLength?: number;
		maxLength?: number;
	};
}

export function validateRequest(schema: ValidationSchema) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = req.body;
			const errors: string[] = [];

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
				logger.warn(`Validation failed for ${req.path}`, { errors });
				return res.status(400).json({ error: "Validation failed", details: errors });
			}

			next();
		} catch (error) {
			logger.error("Validation middleware error", error);
			res.status(500).json({ error: "Validation error" });
		}
	};
}

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
	const sanitize = (obj: any): any => {
		if (typeof obj === "string") {
			return obj.replace(/[<>\"']/g, "");
		} else if (Array.isArray(obj)) {
			return obj.map(sanitize);
		} else if (typeof obj === "object" && obj !== null) {
			const sanitized: any = {};
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

export default { validateRequest, sanitizeInput };
