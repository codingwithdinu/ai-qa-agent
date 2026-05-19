import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";
import prisma from "../config/database";

export interface AuthRequest extends Request {
	userId?: string;
	sessionId?: string;
	user?: any;
}

export async function authMiddleware(
	req: AuthRequest,
	res: Response,
	next: NextFunction
) {

	try {

		const token =
			req.headers.authorization?.replace(
				"Bearer ",
				""
			);

		if (
			!token &&
			!process.env.SKIP_AUTH
		) {

			logger.warn(
				"Missing authorization token"
			);

			return res.status(401).json({

				error:
					"Unauthorized: Missing token",
			});
		}

		if (token) {

			const decoded: any =
				jwt.verify(

					token,

					process.env.JWT_SECRET!
				);

			const user =
				await prisma.user.findUnique({

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

	} catch (error) {

		logger.error(
			"Auth middleware error",
			error
		);

		res.status(500).json({

			error:
				"Internal server error",
		});
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
