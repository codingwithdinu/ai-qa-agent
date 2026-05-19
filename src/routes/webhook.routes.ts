import { Router } from "express";
import prisma from "../config/database";

const router = Router();

router.post("/github", async (req, res) => {

    try {

        const event =
            req.headers["x-github-event"];

        const payload =
            req.body;

        console.log(
            "📦 GitHub Webhook Event:",
            event
        );

        /**
         * PUSH EVENT
         */
        if (event === "push") {

            const repo =
                payload.repository?.full_name;

            const branch =
                payload.ref
                    ?.replace("refs/heads/", "");

            const commit =
                payload.head_commit?.message;

            console.log({
                repo,
                branch,
                commit,
            });

            /**
             * SAVE EXECUTION
             */
            await prisma.testExecution.create({

                data: {

                    recordingId:
                        "demo-recording",

                    status:
                        "PASSED",

                    healedCount:
                        0,

                    duration:
                        12.5,

                    logs:
                        commit || "Push detected",

                    provider:
                        "GitHub Actions",

                    branch:
                        branch || "main",

                    environment:
                        "production",
                },
            });

            console.log(
                "✅ Pipeline execution saved"
            );
        }

        res.json({
            success: true,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
        });
    }
});

export default router;