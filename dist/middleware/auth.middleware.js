"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.optionalAuth = optionalAuth;
const logger_1 = require("../utils/logger");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
async function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token &&
            !process.env.SKIP_AUTH) {
            logger_1.logger.warn("Missing authorization token");
            return res.status(401).json({
                error: "Unauthorized: Missing token",
            });
        }
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await database_1.default.user.findUnique({
                where: {
                    id: decoded.userId,
                },
                include: {
                    memberships: {
                        include: {
                            workspace: true,
                        },
                    },
                },
            });
            req.userId =
                decoded.userId;
            req.sessionId =
                token;
            req.user =
                user;
        }
        next();
    }
    catch (error) {
        logger_1.logger.error("Auth middleware error", error);
        res.status(500).json({
            error: "Internal server error",
        });
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