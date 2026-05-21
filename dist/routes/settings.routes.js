"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const currentUser = await database_1.default.user.findUnique({
            where: {
                id: req.userId,
            },
            include: {
                memberships: {
                    include: {
                        workspace: true,
                    },
                },
            },
        });
        if (!currentUser ||
            currentUser.memberships.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Workspace not found",
            });
        }
        const workspaceId = currentUser.memberships[0]
            .workspaceId;
        const members = await database_1.default.workspaceMember.findMany({
            where: {
                workspaceId,
            },
            include: {
                user: true,
            },
        });
        const teamMembers = members.map((member) => ({
            id: member.user.id,
            name: member.user.name,
            role: member.role,
            region: "India",
            access: member.role === "owner"
                ? "Owner Access"
                : "Full Access",
            status: "Online",
        }));
        const plans = [
            {
                id: "1",
                name: "Starter",
                price: "$29",
                description: "Basic AI QA automation",
                featured: false,
                features: [
                    "100 test runs",
                    "Basic healing",
                ],
            },
            {
                id: "2",
                name: "Enterprise",
                price: "$199",
                description: "Advanced AI automation",
                featured: true,
                features: [
                    "Unlimited runs",
                    "AI healing",
                    "CI/CD integration",
                ],
            },
        ];
        const settingsCards = [
            {
                id: "1",
                title: "API keys",
                detail: "Rotate secrets and manage scoped tokens.",
                icon: "key",
            },
            {
                id: "2",
                title: "AI model settings",
                detail: "Configure healing and AI routing.",
                icon: "shield",
            },
            {
                id: "3",
                title: "Notification settings",
                detail: "Slack, email and PagerDuty alerts.",
                icon: "bell",
            },
            {
                id: "4",
                title: "Environment variables",
                detail: "Manage secrets and environment configs.",
                icon: "lock",
            },
        ];
        const navigationItems = [
            {
                id: "dashboard",
                label: "Dashboard",
                path: "/",
                description: "Overview and analytics",
            },
            {
                id: "recordings",
                label: "Recordings",
                path: "/recordings",
                description: "AI generated flows",
            },
            {
                id: "test-runs",
                label: "Test Runs",
                path: "/test-runs",
                description: "Execution monitoring",
            },
            {
                id: "healing",
                label: "Healing",
                path: "/healing",
                description: "AI selector recovery",
            },
            {
                id: "reports",
                label: "Reports",
                path: "/reports",
                description: "Export analytics",
            },
            {
                id: "pipelines",
                label: "Pipelines",
                path: "/pipelines",
                description: "CI/CD monitoring",
            },
            {
                id: "settings",
                label: "Settings",
                path: "/settings",
                description: "Workspace controls",
            },
        ];
        res.json({
            success: true,
            data: {
                teamMembers,
                plans,
                settingsCards,
                navigationItems,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to load settings",
        });
    }
});
exports.default = router;
//# sourceMappingURL=settings.routes.js.map