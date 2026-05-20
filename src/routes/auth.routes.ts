import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest, sanitizeInput } from "../middleware/validation.middleware";
import { logger } from "../utils/logger";
import prisma from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";


const router = express.Router();

if (!process.env.JWT_SECRET) {

	throw new Error(
		"JWT_SECRET missing"
	);
}

interface AuthRequest
	extends express.Request {
	userId?: string;
}


/**
 * POST /auth/login
 * Login with email and password
 */
router.post(
	"/login",

	sanitizeInput,

	validateRequest({

		email: {
			type: "string",
			required: true,
			pattern:
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		},

		password: {
			type: "string",
			required: true,
			minLength: 8,
		},
	}),

	async (req, res, next) => {

		try {

			const {
				email,
				password,
			} = req.body;

			const user =
				await prisma.user.findUnique({
					where: { email },
				});

			if (!user) {

				return res.status(401).json({
					error:
						"Invalid credentials",
				});
			}

			if (user.password === "oauth") {
				return res.status(400).json({
					error:
						"Use Google or GitHub login",
				});
			}

			const validPassword =
				await bcrypt.compare(
					password,
					user.password || "");

			if (!validPassword) {

				return res.status(401).json({
					error:
						"Invalid credentials",
				});
			}

			const token =
				jwt.sign(
					{
						userId: user.id,
						email: user.email,
					},

					process.env.JWT_SECRET!,

					{
						expiresIn: "7d",
					}
				);

			logger.info(
				`User ${email} logged in`
			);

			res.json({

				success: true,

				token,

				user: {

					id: user.id,

					email: user.email,

					name: user.name,

					workspaces:
						await prisma.workspaceMember.findMany({

							where: {
								userId: user.id,
							},

							include: {
								workspace: true,
							},
						}),
				},
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

		company: {
			type: "string",
			required: true,
		},

		email: {
			type: "string",
			required: true,
			pattern:
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		},

		password: {
			type: "string",
			required: true,
			minLength: 8,
		},

		name: {
			type: "string",
			required: true,
			minLength: 2,
		},
	}),

	async (req, res, next) => {

		try {

			const {
				email,
				password,
				name,
				company,
			} = req.body;

			const existingUser =
				await prisma.user.findUnique({
					where: { email },
				});

			if (existingUser) {

				return res.status(400).json({
					error:
						"User already exists",
				});
			}

			const hashedPassword =
				await bcrypt.hash(
					password,
					10
				);

			const slug =
				company
					.toLowerCase()
					.replace(/\s+/g, "-")
				+
				"-"
				+
				Date.now();

			const user =
				await prisma.user.create({
					data: {
						email,
						password:
							hashedPassword,
						name,
					},
				});

			const workspace =
				await prisma.workspace.create({
					data: {
						name:
							company,
						slug,
						ownerId:
							user.id,
					},
				});

			await prisma.workspaceMember.create({
				data: {
					userId:
						user.id,
					workspaceId:
						workspace.id,
					role:
						"owner",
				},
			});

			const token =
				jwt.sign(
					{
						userId: user.id,
						email: user.email,
					},

					process.env.JWT_SECRET!,

					{
						expiresIn: "7d",
					}
				);

			logger.info(
				`New user registered: ${email}`
			);

			res.status(201).json({

				success: true,

				token,

				user: {

					id: user.id,

					email: user.email,

					name: user.name,

					workspaces:
						await prisma.workspaceMember.findMany({

							where: {
								userId: user.id,
							},

							include: {
								workspace: true,
							},
						}),
				},
			});

		} catch (error) {

			next(error);
		}
	}
);


router.get(
	"/google",

	passport.authenticate(
		"google",
		{
			scope: [
				"profile",
				"email",
			],
		}
	)
);

router.get(
	"/google/callback",

	passport.authenticate("google", {
		failureRedirect:
			"http://localhost:5173/login",
		session: false,
	}),

	async (req: any, res) => {

		const user = req.user;

		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
			},
			process.env.JWT_SECRET!,
			{
				expiresIn: "7d",
			}
		);

		res.redirect(
			`http://localhost:5173/oauth-success?token=${token}`
		);
	}
);


router.get(
	"/github",

	passport.authenticate(
		"github",
		{
			scope: [
				"user:email",
			],
		}
	)
);

router.get(
	"/github/callback",

	passport.authenticate(
		"github",
		{
			failureRedirect:
				"/login",
		}
	),

	async (req: any, res) => {

		const token =
			jwt.sign(
				{
					userId:
						req.user.id,
				},

				process.env.JWT_SECRET!,

				{
					expiresIn: "7d",
				}
			);

		res.redirect(
			`http://localhost:5173/oauth-success?token=${token}`
		);
	});

/**
 * POST /auth/logout
 * Logout current user
 */
router.post("/logout", authMiddleware, async (req: AuthRequest, res) => {
	logger.info(`User ${req.userId} logged out`);
	res.json({ success: true, message: "Logged out successfully" });
});

/**
 * GET /auth/me
 * Get current user info
 */
router.get(
	"/me",

	authMiddleware,

	async (req: AuthRequest, res) => {

		try {

			const user =
				await prisma.user.findUnique({

					where: {
						id: req.userId,
					},
				});

			if (!user) {

				return res.status(404).json({
					error:
						"User not found",
				});
			}

			res.json({

				authenticated: true,

				user: {

					id: user.id,

					name: user.name,

					email: user.email,

					workspaces:
						await prisma.workspaceMember.findMany({

							where: {
								userId: user.id,
							},

							include: {
								workspace: true,
							},
						}),
				},
			});

		} catch {

			res.status(500).json({
				error:
					"Failed to retrieve user",
			});
		}
	});
router.post(
	"/forgot-password",

	async (req, res) => {

		try {

			const { email } =
				req.body;

			const user =
				await prisma.user.findUnique({

					where: { email },
				});

			if (!user) {

				return res.status(404).json({

					error:
						"User not found",
				});
			}

			res.json({

				success: true,
			});

		} catch {

			res.status(500).json({

				error:
					"Forgot password failed",
			});
		}
	}
);

export default router;
