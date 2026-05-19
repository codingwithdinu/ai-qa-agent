import { Router } from "express";

const router = Router();

router.get("/", async (_req, res) => {

    try {

        const workspaces = [

            {
                id: "workspace-1",
                name: "AI QA Workspace",
                plan: "Enterprise",
                role: "Admin",
                initials: "AI",
            },
        ];

        const projects = [

            {
                id: "project-1",
                name: "AI QA Agent",
                status: "active",
                environment: "production",
            },
        ];

        const notifications = [

            {
                id: "1",
                title: "AI healing active",
                description:
                    "Selectors repaired automatically.",
                tone: "success",
            },

            {
                id: "2",
                title: "Pipeline synced",
                description:
                    "CI/CD telemetry updated.",
            },
        ];

        const searchCommands = [

            {
                id: "1",
                title: "Open dashboard",
                subtitle: "Navigate to analytics dashboard",
                to: "/app/dashboard",
                shortcut: "⌘D",
            },

            {
                id: "2",
                title: "View reports",
                subtitle: "Open reporting center",
                to: "/app/reports",
                shortcut: "⌘R",
            },
        ]; const navigationItems = [

            {
                id: "dashboard",
                label: "Dashboard",
                path: "/app/dashboard",
                description: "Overview and analytics",
            },

            {
                id: "recordings",
                label: "Recordings",
                path: "/app/recordings",
                description: "AI generated flows",
            },

            {
                id: "test-runs",
                label: "Test Runs",
                path: "/app/test-runs",
                description: "Execution monitoring",
            },

            {
                id: "healing",
                label: "Healing",
                path: "/app/healing",
                description: "AI selector recovery",
            },

            {
                id: "reports",
                label: "Reports",
                path: "/app/reports",
                description: "Export analytics",
            },

            {
                id: "pipelines",
                label: "Pipelines",
                path: "/app/pipelines",
                description: "CI/CD monitoring",
            },

            {
                id: "settings",
                label: "Settings",
                path: "/app/settings",
                description: "Workspace controls",
            },
        ];
        res.json({

            success: true,

            data: {

                workspaces,

                projects,

                notifications,

                searchCommands,

                navigationItems,
            },
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to load app shell",
        });
    }
});

export default router;