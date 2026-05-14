"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.optionalAuth = optionalAuth;
const logger_1 = require("../utils/logger");
async function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token && !process.env.SKIP_AUTH) {
            logger_1.logger.warn("Missing authorization token");
            return res.status(401).json({ error: "Unauthorized: Missing token" });
        }
        // Verify token (simplified - in production use JWT)
        if (token) {
            req.userId = token.split(".")[0]; // Extract user ID from token
            req.sessionId = token;
        }
        next();
    }
    catch (error) {
        logger_1.logger.error("Auth middleware error", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
function optionalAuth(req, res, next) {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (token) {
            req.userId = token.split(".")[0];
            req.sessionId = token;
        }
        next();
    }
    catch (error) {
        logger_1.logger.error("Optional auth error", error);
        next(); // Continue even if auth fails
    }
}
exports.default = { authMiddleware, optionalAuth };
//# sourceMappingURL=auth.middleware.js.map