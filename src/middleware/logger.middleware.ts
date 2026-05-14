import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { redactSecrets } from "../utils/helpers";

interface LogMeta {
	method: string;
	path: string;
	status?: number;
	duration?: number;
	userAgent?: string;
	timestamp: string;
}

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
	const startTime = Date.now();

	const logMeta: LogMeta = {
		method: req.method,
		path: req.path,
		userAgent: req.get("user-agent"),
		timestamp: new Date().toISOString(),
	};

	// Log incoming request
	logger.info(`${req.method} ${req.path}`, redactSecrets(logMeta));

	// Override res.json to log response
	const originalJson = res.json;
	res.json = function (data: any) {
		const duration = Date.now() - startTime;
		logMeta.status = res.statusCode;
		logMeta.duration = duration;

		logger.info(`${req.method} ${req.path} - ${res.statusCode}`, redactSecrets(logMeta));

		return originalJson.call(this, data);
	};

	next();
}

export default { loggerMiddleware };
