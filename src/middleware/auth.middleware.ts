import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export interface AuthRequest extends Request {
	userId?: string;
	sessionId?: string;
	user?: any;
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
	try {
		const token = req.headers.authorization?.replace("Bearer ", "");

		if (!token && !process.env.SKIP_AUTH) {
			logger.warn("Missing authorization token");
			return res.status(401).json({ error: "Unauthorized: Missing token" });
		}

		// Verify token (simplified - in production use JWT)
		if (token) {
			req.userId = token.split(".")[0]; // Extract user ID from token
			req.sessionId = token;
		}

		next();
	} catch (error) {
		logger.error("Auth middleware error", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
	try {
		const token = req.headers.authorization?.replace("Bearer ", "");
		if (token) {
			req.userId = token.split(".")[0];
			req.sessionId = token;
		}
		next();
	} catch (error) {
		logger.error("Optional auth error", error);
		next(); // Continue even if auth fails
	}
}

export default { authMiddleware, optionalAuth };
