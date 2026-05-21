"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorMiddleware = errorMiddleware;
exports.handleAsyncErrors = handleAsyncErrors;
const logger_1 = require("../utils/logger");
function errorMiddleware(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    logger_1.logger.error(`Error [${statusCode}]: ${message}`, err);
    // Don't expose sensitive error details in production
    const isProduction = process.env.NODE_ENV === "production";
    const errorResponse = {
        error: message,
        statusCode,
    };
    if (!isProduction) {
        errorResponse.stack = err.stack;
        errorResponse.details = err;
    }
    res.status(statusCode).json(errorResponse);
}
function handleAsyncErrors(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = "AppError";
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
exports.default = { errorMiddleware, handleAsyncErrors, AppError };
//# sourceMappingURL=error.middleware.js.map