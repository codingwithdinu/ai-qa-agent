import { logger } from "../../utils/logger";

interface User {
	email: string;
	password: string;
	name: string;
	createdAt: Date;
}

// Mock user database
const users: { [key: string]: User } = {};

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string): Promise<string | null> {
	try {
		const user = users[email];

		if (!user || user.password !== password) {
			logger.warn(`Failed authentication attempt for ${email}`);
			return null;
		}

		const token = Buffer.from(`${email}.${Date.now()}.${Math.random()}`).toString("base64");
		logger.info(`User ${email} authenticated successfully`);

		return token;
	} catch (error: any) {
		logger.error("Authentication error", error);
		return null;
	}
}

/**
 * Register new user
 */
export async function registerUser(email: string, password: string, name: string): Promise<boolean> {
	try {
		if (users[email]) {
			logger.warn(`Registration failed: User ${email} already exists`);
			return false;
		}

		users[email] = {
			email,
			password, // In production, hash the password!
			name,
			createdAt: new Date(),
		};

		logger.info(`New user registered: ${email}`);
		return true;
	} catch (error: any) {
		logger.error("Registration error", error);
		return false;
	}
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
	return users[email] || null;
}

/**
 * Change user password
 */
export async function changePassword(email: string, oldPassword: string, newPassword: string): Promise<boolean> {
	try {
		const user = users[email];

		if (!user || user.password !== oldPassword) {
			logger.warn(`Password change failed for ${email}: Invalid old password`);
			return false;
		}

		users[email].password = newPassword;
		logger.info(`Password changed for user ${email}`);

		return true;
	} catch (error: any) {
		logger.error("Password change error", error);
		return false;
	}
}

export default {
	authenticateUser,
	registerUser,
	getUserByEmail,
	changePassword,
};
