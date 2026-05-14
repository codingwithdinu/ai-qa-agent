import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";

	logger.error(`Error [${statusCode}]: ${message}`, err);

	// Don't expose sensitive error details in production
	const isProduction = process.env.NODE_ENV === "production";
	const errorResponse: any = {
		error: message,
		statusCode,
	};

	if (!isProduction) {
		errorResponse.stack = err.stack;
		errorResponse.details = err;
	}

	res.status(statusCode).json(errorResponse);
}

export function handleAsyncErrors(fn: Function) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

export class AppError extends Error {
	constructor(public message: string, public statusCode: number = 500) {
		super(message);
		this.name = "AppError";
		Object.setPrototypeOf(this, AppError.prototype);
	}
}

export default { errorMiddleware, handleAsyncErrors, AppError };
