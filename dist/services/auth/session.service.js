"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.getSession = getSession;
exports.refreshSession = refreshSession;
exports.destroySession = destroySession;
exports.getUserSessions = getUserSessions;
const logger_1 = require("../../utils/logger");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const SESSION_STORAGE_DIR = "./auth-state";
const SESSION_TIMEOUT = 3600000; // 1 hour
const activeSessions = {};
/**
 * Create a new session
 */
async function createSession(userId, email, token) {
    try {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const session = {
            id: sessionId,
            userId,
            email,
            token,
            createdAt: Date.now(),
            expiresAt: Date.now() + SESSION_TIMEOUT,
            lastActivity: Date.now(),
        };
        activeSessions[sessionId] = session;
        // Persist to file with restricted permissions
        const sessionFile = path.join(SESSION_STORAGE_DIR, `${sessionId}.json`);
        if (!fs.existsSync(SESSION_STORAGE_DIR)) {
            fs.mkdirSync(SESSION_STORAGE_DIR, { recursive: true });
        }
        fs.writeFileSync(sessionFile, JSON.stringify(session), { flag: "w" });
        fs.chmodSync(sessionFile, 0o600); // Restrict to owner only
        logger_1.logger.info(`Session created for user ${email}: ${sessionId}`);
        return session;
    }
    catch (error) {
        logger_1.logger.error("Session creation error", error);
        throw error;
    }
}
/**
 * Verify and get session
 */
async function getSession(sessionId) {
    try {
        let session = activeSessions[sessionId];
        if (!session) {
            // Try to load from file
            const sessionFile = path.join(SESSION_STORAGE_DIR, `${sessionId}.json`);
            if (fs.existsSync(sessionFile)) {
                const data = fs.readFileSync(sessionFile, "utf-8");
                session = JSON.parse(data);
                activeSessions[sessionId] = session;
            }
        }
        if (!session) {
            return null;
        }
        // Check if session expired
        if (session.expiresAt < Date.now()) {
            await destroySession(sessionId);
            return null;
        }
        // Update last activity
        session.lastActivity = Date.now();
        activeSessions[sessionId] = session;
        return session;
    }
    catch (error) {
        logger_1.logger.error("Session retrieval error", error);
        return null;
    }
}
/**
 * Refresh session expiry
 */
async function refreshSession(sessionId) {
    try {
        const session = await getSession(sessionId);
        if (!session) {
            return false;
        }
        session.expiresAt = Date.now() + SESSION_TIMEOUT;
        activeSessions[sessionId] = session;
        logger_1.logger.info(`Session refreshed: ${sessionId}`);
        return true;
    }
    catch (error) {
        logger_1.logger.error("Session refresh error", error);
        return false;
    }
}
/**
 * Destroy/logout session
 */
async function destroySession(sessionId) {
    try {
        delete activeSessions[sessionId];
        const sessionFile = path.join(SESSION_STORAGE_DIR, `${sessionId}.json`);
        if (fs.existsSync(sessionFile)) {
            fs.unlinkSync(sessionFile);
        }
        logger_1.logger.info(`Session destroyed: ${sessionId}`);
        return true;
    }
    catch (error) {
        logger_1.logger.error("Session destruction error", error);
        return false;
    }
}
/**
 * Get all active sessions for a user
 */
async function getUserSessions(userId) {
    try {
        return Object.values(activeSessions).filter((s) => s.userId === userId);
    }
    catch (error) {
        logger_1.logger.error("Get user sessions error", error);
        return [];
    }
}
exports.default = {
    createSession,
    getSession,
    refreshSession,
    destroySession,
    getUserSessions,
};
//# sourceMappingURL=session.service.js.map