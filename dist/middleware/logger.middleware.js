"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = loggerMiddleware;
const logger_1 = require("../utils/logger");
const helpers_1 = require("../utils/helpers");
function loggerMiddleware(req, res, next) {
    const startTime = Date.now();
    const logMeta = {
        method: req.method,
        path: req.path,
        userAgent: req.get("user-agent"),
        timestamp: new Date().toISOString(),
    };
    // Log incoming request
    logger_1.logger.info(`${req.method} ${req.path}`, (0, helpers_1.redactSecrets)(logMeta));
    // Override res.json to log response
    const originalJson = res.json;
    res.json = function (data) {
        const duration = Date.now() - startTime;
        logMeta.status = res.statusCode;
        logMeta.duration = duration;
        logger_1.logger.info(`${req.method} ${req.path} - ${res.statusCode}`, (0, helpers_1.redactSecrets)(logMeta));
        return originalJson.call(this, data);
    };
    next();
}
exports.default = { loggerMiddleware };
//# sourceMappingURL=logger.middleware.js.map