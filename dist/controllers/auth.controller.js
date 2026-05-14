"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = verifyAuth;
exports.refreshSession = refreshSession;
exports.getAuthInfo = getAuthInfo;
const logger_1 = require("../utils/logger");
/**
 * POST /auth/verify
 * Verify user session
 */
async function verifyAuth(req, res) {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        res.json({
            authenticated: true,
            userId: req.userId,
            sessionId: req.sessionId,
        });
    }
    catch (error) {
        logger_1.logger.error("Auth verification error", error);
        res.status(500).json({ error: "Verification failed" });
    }
}
/**
 * POST /auth/refresh
 * Refresh user session
 */
async function refreshSession(req, res) {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        const newToken = Buffer.from(`${req.userId}.${Date.now()}`).toString("base64");
        logger_1.logger.info(`Session refreshed for user ${req.userId}`);
        res.json({
            success: true,
            token: newToken,
        });
    }
    catch (error) {
        logger_1.logger.error("Session refresh error", error);
        res.status(500).json({ error: "Refresh failed" });
    }
}
/**
 * GET /auth/info
 * Get auth info for current user
 */
async function getAuthInfo(req, res) {
    try {
        res.json({
            userId: req.userId,
            sessionId: req.sessionId,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.logger.error("Get auth info error", error);
        res.status(500).json({ error: "Failed to get auth info" });
    }
}
exports.default = { verifyAuth, refreshSession, getAuthInfo };
//# sourceMappingURL=auth.controller.js.map