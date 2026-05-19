import { Router } from "express";
import prisma from "../config/database";

const router = Router();

router.post("/github", async (req, res) => {

    try {

        console.log("🔥 WEBHOOK HIT");

        const event = req.headers["x-github-event"];
        const payload = req.body;

        console.log("EVENT:", event);

        /**
         * WORKFLOW RUN EVENT
         */
        if (event === "workflow_run") {

            const workflow =
                payload.workflow_run;

            console.log("WORKFLOW:", workflow);

            await prisma.testExecution.create({

                data: {

                    recordingId:
                        "193be516-cbd7-43b9-9f93-3c45a5ddbacb",

                    status:
                        workflow.conclusion === "success"
                            ? "PASSED"
                            : "FAILED",

                    healedCount: 0,

                    duration:
                        15.5,

                    logs:
                        workflow.name || "Workflow run",

                    provider:
                        "GitHub Actions",

                    branch:
                        workflow.head_branch || "main",

                    environment:
                        "production",

                    commitHash:
                        workflow.head_sha,

                    repository:
                        payload.repository?.full_name,

                    workflowName:
                        workflow.name,

                    actor:
                        workflow.actor?.login,

                    commitMessage:
                        workflow.head_commit?.message || "No commit",

                    buildNumber:
                        String(workflow.run_number),
                },
            });

            console.log("✅ Workflow execution saved");
        }

        res.json({
            success: true,
        });

    } catch (error) {

        console.error("❌ WEBHOOK ERROR:");
        console.error(error);

        res.status(400).json({

            success: false,

            message:
                "Webhook failed",
        });
    }
});

export default router;