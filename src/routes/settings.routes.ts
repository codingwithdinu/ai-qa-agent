import { Router } from "express";
import prisma from "../config/database";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";


const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
    try {
        const currentUser =
            await prisma.user.findUnique({
                where: {
                    id: req.userId!,
                },
                include: {
                    memberships: {
                        include: {
                            workspace: true,
                        },
                    },
                },
            });

        if (
            !currentUser ||
            currentUser.memberships.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Workspace not found",
            });
        }

        const workspaceId =
            currentUser.memberships[0]
                .workspaceId;

        const members =
            await prisma.workspaceMember.findMany({

                where: {
                    workspaceId,
                },

                include: {
                    user: true,
                },
            });

        const teamMembers =
            members.map((member) => ({

                id:
                    member.user.id,

                name:
                    member.user.name,

                role:
                    member.role,

                region:
                    "India",

                access:
                    member.role === "owner"
                        ? "Owner Access"
                        : "Full Access",

                status:
                    "Online",
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
                detail:
                    "Rotate secrets and manage scoped tokens.",
                icon: "key",
            },

            {
                id: "2",
                title: "AI model settings",
                detail:
                    "Configure healing and AI routing.",
                icon: "shield",
            },

            {
                id: "3",
                title: "Notification settings",
                detail:
                    "Slack, email and PagerDuty alerts.",
                icon: "bell",
            },

            {
                id: "4",
                title: "Environment variables",
                detail:
                    "Manage secrets and environment configs.",
                icon: "lock",
            },
        ];

        const navigationItems = [

            {
                id: "dashboard",
                label: "Dashboard",
                path: "/",
                description:
                    "Overview and analytics",
            },

            {
                id: "recordings",
                label: "Recordings",
                path: "/recordings",
                description:
                    "AI generated flows",
            },

            {
                id: "test-runs",
                label: "Test Runs",
                path: "/test-runs",
                description:
                    "Execution monitoring",
            },

            {
                id: "healing",
                label: "Healing",
                path: "/healing",
                description:
                    "AI selector recovery",
            },

            {
                id: "reports",
                label: "Reports",
                path: "/reports",
                description:
                    "Export analytics",
            },

            {
                id: "pipelines",
                label: "Pipelines",
                path: "/pipelines",
                description:
                    "CI/CD monitoring",
            },

            {
                id: "settings",
                label: "Settings",
                path: "/settings",
                description:
                    "Workspace controls",
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

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to load settings",
        });
    }
});

export default router;