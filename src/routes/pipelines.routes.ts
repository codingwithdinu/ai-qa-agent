import { Router } from "express";
import prisma from "../config/database";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";




const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
    try {

        const executions =
            await prisma.testExecution.findMany({
                where: {
                    recording: {
                        userId:
                            req.userId!,
                    },
                },
                orderBy: {
                    createdAt:
                        "desc",
                },
            });

        const pipelineItems =
            executions.map((e) => ({

                id: e.id,

                provider:
                    e.provider || "Local Runner",

                branch:
                    e.branch || "main",

                environment:
                    e.environment || "development",

                status:
                    e.status === "PASSED"
                        ? "Passing"
                        : e.status === "FAILED"
                            ? "Failed"
                            : "Running",

                duration:
                    `${e.duration || 0}s`,

                qaGate:
                    e.status === "FAILED"
                        ? "Blocked"
                        : e.healedCount > 0
                            ? "AI Healed"
                            : "Passed",

                health:
                    e.status === "FAILED"
                        ? "critical"
                        : e.healedCount > 0
                            ? "warning"
                            : "healthy",

            }));

        const deploymentTimeline =
            executions.map((e) => ({

                id: e.id,

                stage:
                    e.status === "PASSED"
                        ? "Deployment Complete"
                        : e.status === "FAILED"
                            ? "Deployment Failed"
                            : "Validation Running",
                status:
                    e.status === "PASSED"
                        ? "complete"
                        : "active",

                detail:
                    e.logs?.slice(0, 100) ||
                    "No logs",
            }));

        res.json({

            success: true,

            data: {

                pipelineItems,

                deploymentTimeline,
            },
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Pipeline analytics failed",
        });
    }
});

export default router;