"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
// Mock user storage (in production, use database)
const users = {};
/**
 * POST /auth/login
 * Login with email and password
 */
router.post("/login", validation_middleware_1.sanitizeInput, (0, validation_middleware_1.validateRequest)({
    email: { type: "string", required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: "string", required: true, minLength: 6 },
}), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Simplified auth (in production use bcrypt)
        const user = users[email];
        if (!user || user.password !== password) {
            logger_1.logger.warn(`Failed login attempt for ${email}`);
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = Buffer.from(`${email}.${Date.now()}`).toString("base64");
        logger_1.logger.info(`User ${email} logged in successfully`);
        res.json({
            success: true,
            token,
            user: { email: user.email, name: user.name },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * POST /auth/signup
 * Create a new user account
 */
router.post("/signup", validation_middleware_1.sanitizeInput, (0, validation_middleware_1.validateRequest)({
    email: { type: "string", required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: "string", required: true, minLength: 6 },
    name: { type: "string", required: true, minLength: 2 },
}), async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        if (users[email]) {
            return res.status(400).json({ error: "User already exists" });
        }
        users[email] = { email, password, name };
        const token = Buffer.from(`${email}.${Date.now()}`).toString("base64");
        logger_1.logger.info(`New user registered: ${email}`);
        res.status(201).json({
            success: true,
            token,
            user: { email, name },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * POST /auth/logout
 * Logout current user
 */
router.post("/logout", auth_middleware_1.authMiddleware, async (req, res) => {
    logger_1.logger.info(`User ${req.userId} logged out`);
    res.json({ success: true, message: "Logged out successfully" });
});
/**
 * GET /auth/me
 * Get current user info
 */
router.get("/me", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        res.json({
            userId: req.userId,
            sessionId: req.sessionId,
            authenticated: true,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrieve user info" });
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map