import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest, sanitizeInput } from "../middleware/validation.middleware";
import { logger } from "../utils/logger";

const router = express.Router();

interface LoginRequest {
	email: string;
	password: string;
}

interface SignupRequest {
	email: string;
	password: string;
	name: string;
}

// Mock user storage (in production, use database)
const users: { [key: string]: any } = {};

/**
 * POST /auth/login
 * Login with email and password
 */
router.post(
	"/login",
	sanitizeInput,
	validateRequest({
		email: { type: "string", required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
		password: { type: "string", required: true, minLength: 6 },
	}),
	async (req, res, next) => {
		try {
			const { email, password } = req.body as LoginRequest;

			// Simplified auth (in production use bcrypt)
			const user = users[email];
			if (!user || user.password !== password) {
				logger.warn(`Failed login attempt for ${email}`);
				return res.status(401).json({ error: "Invalid credentials" });
			}

			const token = Buffer.from(`${email}.${Date.now()}`).toString("base64");

			logger.info(`User ${email} logged in successfully`);
			res.json({
				success: true,
				token,
				user: { email: user.email, name: user.name },
			});
		} catch (error) {
			next(error);
		}
	}
);

/**
 * POST /auth/signup
 * Create a new user account
 */
router.post(
	"/signup",
	sanitizeInput,
	validateRequest({
		email: { type: "string", required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
		password: { type: "string", required: true, minLength: 6 },
		name: { type: "string", required: true, minLength: 2 },
	}),
	async (req, res, next) => {
		try {
			const { email, password, name } = req.body as SignupRequest;

			if (users[email]) {
				return res.status(400).json({ error: "User already exists" });
			}

			users[email] = { email, password, name };
			const token = Buffer.from(`${email}.${Date.now()}`).toString("base64");

			logger.info(`New user registered: ${email}`);
			res.status(201).json({
				success: true,
				token,
				user: { email, name },
			});
		} catch (error) {
			next(error);
		}
	}
);

/**
 * POST /auth/logout
 * Logout current user
 */
router.post("/logout", authMiddleware, async (req: any, res) => {
	logger.info(`User ${req.userId} logged out`);
	res.json({ success: true, message: "Logged out successfully" });
});

/**
 * GET /auth/me
 * Get current user info
 */
router.get("/me", authMiddleware, async (req: any, res) => {
	try {
		res.json({
			userId: req.userId,
			sessionId: req.sessionId,
			authenticated: true,
		});
	} catch (error) {
		res.status(500).json({ error: "Failed to retrieve user info" });
	}
});

export default router;
