"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
exports.registerUser = registerUser;
exports.getUserByEmail = getUserByEmail;
exports.changePassword = changePassword;
const logger_1 = require("../../utils/logger");
// Mock user database
const users = {};
/**
 * Authenticate user with email and password
 */
async function authenticateUser(email, password) {
    try {
        const user = users[email];
        if (!user || user.password !== password) {
            logger_1.logger.warn(`Failed authentication attempt for ${email}`);
            return null;
        }
        const token = Buffer.from(`${email}.${Date.now()}.${Math.random()}`).toString("base64");
        logger_1.logger.info(`User ${email} authenticated successfully`);
        return token;
    }
    catch (error) {
        logger_1.logger.error("Authentication error", error);
        return null;
    }
}
/**
 * Register new user
 */
async function registerUser(email, password, name) {
    try {
        if (users[email]) {
            logger_1.logger.warn(`Registration failed: User ${email} already exists`);
            return false;
        }
        users[email] = {
            email,
            password, // In production, hash the password!
            name,
            createdAt: new Date(),
        };
        logger_1.logger.info(`New user registered: ${email}`);
        return true;
    }
    catch (error) {
        logger_1.logger.error("Registration error", error);
        return false;
    }
}
/**
 * Get user by email
 */
async function getUserByEmail(email) {
    return users[email] || null;
}
/**
 * Change user password
 */
async function changePassword(email, oldPassword, newPassword) {
    try {
        const user = users[email];
        if (!user || user.password !== oldPassword) {
            logger_1.logger.warn(`Password change failed for ${email}: Invalid old password`);
            return false;
        }
        users[email].password = newPassword;
        logger_1.logger.info(`Password changed for user ${email}`);
        return true;
    }
    catch (error) {
        logger_1.logger.error("Password change error", error);
        return false;
    }
}
exports.default = {
    authenticateUser,
    registerUser,
    getUserByEmail,
    changePassword,
};
//# sourceMappingURL=login.service.js.map