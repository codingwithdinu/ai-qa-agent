import { logger } from "../../utils/logger";
import * as fs from "fs";
import * as path from "path";

const SESSION_STORAGE_DIR = "./auth-state";
const SESSION_TIMEOUT = 3600000; // 1 hour

interface Session {
	id: string;
	userId: string;
	email: string;
	token: string;
	createdAt: number;
	expiresAt: number;
	lastActivity: number;
}

const activeSessions: { [key: string]: Session } = {};

/**
 * Create a new session
 */
export async function createSession(userId: string, email: string, token: string): Promise<Session> {
	try {
		const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		const session: Session = {
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

		logger.info(`Session created for user ${email}: ${sessionId}`);

		return session;
	} catch (error: any) {
		logger.error("Session creation error", error);
		throw error;
	}
}

/**
 * Verify and get session
 */
export async function getSession(sessionId: string): Promise<Session | null> {
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
	} catch (error: any) {
		logger.error("Session retrieval error", error);
		return null;
	}
}

/**
 * Refresh session expiry
 */
export async function refreshSession(sessionId: string): Promise<boolean> {
	try {
		const session = await getSession(sessionId);
		if (!session) {
			return false;
		}

		session.expiresAt = Date.now() + SESSION_TIMEOUT;
		activeSessions[sessionId] = session;

		logger.info(`Session refreshed: ${sessionId}`);
		return true;
	} catch (error: any) {
		logger.error("Session refresh error", error);
		return false;
	}
}

/**
 * Destroy/logout session
 */
export async function destroySession(sessionId: string): Promise<boolean> {
	try {
		delete activeSessions[sessionId];

		const sessionFile = path.join(SESSION_STORAGE_DIR, `${sessionId}.json`);
		if (fs.existsSync(sessionFile)) {
			fs.unlinkSync(sessionFile);
		}

		logger.info(`Session destroyed: ${sessionId}`);
		return true;
	} catch (error: any) {
		logger.error("Session destruction error", error);
		return false;
	}
}

/**
 * Get all active sessions for a user
 */
export async function getUserSessions(userId: string): Promise<Session[]> {
	try {
		return Object.values(activeSessions).filter((s) => s.userId === userId);
	} catch (error: any) {
		logger.error("Get user sessions error", error);
		return [];
	}
}

export default {
	createSession,
	getSession,
	refreshSession,
	destroySession,
	getUserSessions,
};
