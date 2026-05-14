import { Request, Response } from "express";
import { logger } from "../utils/logger";

interface AuthRequest extends Request {
	userId?: string;
	sessionId?: string;
}

/**
 * POST /auth/verify
 * Verify user session
 */
export async function verifyAuth(req: AuthRequest, res: Response) {
	try {
		if (!req.userId) {
			return res.status(401).json({ error: "Not authenticated" });
		}

		res.json({
			authenticated: true,
			userId: req.userId,
			sessionId: req.sessionId,
		});
	} catch (error: any) {
		logger.error("Auth verification error", error);
		res.status(500).json({ error: "Verification failed" });
	}
}

/**
 * POST /auth/refresh
 * Refresh user session
 */
export async function refreshSession(req: AuthRequest, res: Response) {
	try {
		if (!req.userId) {
			return res.status(401).json({ error: "Not authenticated" });
		}

		const newToken = Buffer.from(`${req.userId}.${Date.now()}`).toString("base64");

		logger.info(`Session refreshed for user ${req.userId}`);
		res.json({
			success: true,
			token: newToken,
		});
	} catch (error: any) {
		logger.error("Session refresh error", error);
		res.status(500).json({ error: "Refresh failed" });
	}
}

/**
 * GET /auth/info
 * Get auth info for current user
 */
export async function getAuthInfo(req: AuthRequest, res: Response) {
	try {
		res.json({
			userId: req.userId,
			sessionId: req.sessionId,
			timestamp: new Date().toISOString(),
		});
	} catch (error: any) {
		logger.error("Get auth info error", error);
		res.status(500).json({ error: "Failed to get auth info" });
	}
}

export default { verifyAuth, refreshSession, getAuthInfo };
