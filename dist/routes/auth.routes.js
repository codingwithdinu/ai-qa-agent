"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const logger_1 = require("../utils/logger");
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing");
}
/**
 * POST /auth/login
 * Login with email and password
 */
router.post("/login", validation_middleware_1.sanitizeInput, (0, validation_middleware_1.validateRequest)({
    email: {
        type: "string",
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: "string",
        required: true,
        minLength: 8,
    },
}), async (req, res, next) => {
    try {
        const { email, password, } = req.body;
        const user = await database_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({
                error: "Invalid credentials",
            });
        }
        if (user.password === "oauth") {
            return res.status(400).json({
                error: "Use Google or GitHub login",
            });
        }
        const validPassword = await bcryptjs_1.default.compare(password, user.password || "");
        if (!validPassword) {
            return res.status(401).json({
                error: "Invalid credentials",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        logger_1.logger.info(`User ${email} logged in`);
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                workspaces: await database_1.default.workspaceMember.findMany({
                    where: {
                        userId: user.id,
                    },
                    include: {
                        workspace: true,
                    },
                }),
            },
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
    company: {
        type: "string",
        required: true,
    },
    email: {
        type: "string",
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
}), async (req, res, next) => {
    try {
        const { email, password, name, company, } = req.body;
        const existingUser = await database_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({
                error: "User already exists",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const slug = company
            .toLowerCase()
            .replace(/\s+/g, "-")
            +
                "-"
            +
                Date.now();
        const user = await database_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        const workspace = await database_1.default.workspace.create({
            data: {
                name: company,
                slug,
                ownerId: user.id,
            },
        });
        await database_1.default.workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId: workspace.id,
                role: "owner",
            },
        });
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        logger_1.logger.info(`New user registered: ${email}`);
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                workspaces: await database_1.default.workspaceMember.findMany({
                    where: {
                        userId: user.id,
                    },
                    include: {
                        workspace: true,
                    },
                }),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/google", passport_1.default.authenticate("google", {
    scope: [
        "profile",
        "email",
    ],
}));
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
}), async (req, res) => {
    const user = req.user;
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
});
router.get("/github", passport_1.default.authenticate("github", {
    scope: [
        "user:email",
    ],
}));
router.get("/github/callback", passport_1.default.authenticate("github", {
    failureRedirect: "/login",
}), async (req, res) => {
    const token = jsonwebtoken_1.default.sign({
        userId: req.user.id,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
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
        const user = await database_1.default.user.findUnique({
            where: {
                id: req.userId,
            },
        });
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }
        res.json({
            authenticated: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                workspaces: await database_1.default.workspaceMember.findMany({
                    where: {
                        userId: user.id,
                    },
                    include: {
                        workspace: true,
                    },
                }),
            },
        });
    }
    catch {
        res.status(500).json({
            error: "Failed to retrieve user",
        });
    }
});
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await database_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }
        res.json({
            success: true,
        });
    }
    catch {
        res.status(500).json({
            error: "Forgot password failed",
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map