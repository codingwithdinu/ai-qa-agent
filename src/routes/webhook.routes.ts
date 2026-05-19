import { Router } from "express";
import prisma from "../config/database";
import { io } from "../server";


const router = Router();

router.post("/github", async (req, res) => {

    try {

        const event =
            req.headers["x-github-event"];

        const payload = req.body;

        // console.log("===========");
        // console.log("EVENT:", event);
        // console.log("ACTION:", payload.action);

        // console.log(
        //     "WORKFLOW:",
        //     payload.workflow?.name ||
        //     payload.workflow_run?.name
        // );

        // console.log(
        //     "REPO:",
        //     payload.repository?.full_name
        // );

        // console.log(
        //     "CONCLUSION:",
        //     payload.workflow_run?.conclusion
        // );

        // console.log("===========");

        /**
         * ONLY HANDLE workflow_run EVENTS
         */
        if (event !== "workflow_run") {

            return res.status(200).json({

                success: true,

                message:
                    "Event ignored",
            });
        }

        const workflowRun =
            payload.workflow_run;

        if (!workflowRun) {

            return res.status(400).json({

                success: false,

                message:
                    "No workflow_run payload",
            });
        }

        /**
         * FIND RECORDING
         */
        const recording =
            await prisma.recording.findFirst();

        if (!recording) {

            return res.status(404).json({

                success: false,

                message:
                    "No recording found",
            });
        }

        /**
         * SAVE EXECUTION
         */
        const existingExecution =
            await prisma.testExecution.findFirst({

                where: {

                    githubRunId:
                        workflowRun.id.toString(),
                },
            });

        if (existingExecution) {

            await prisma.testExecution.update({

                where: {
                    id: existingExecution.id,
                },

                data: {

                    status:
                        workflowRun.conclusion === "success"
                            ? "PASSED"
                            : workflowRun.conclusion === "failure"
                                ? "FAILED"
                                : "RUNNING",

                    duration:
                        workflowRun.run_started_at &&
                            workflowRun.updated_at
                            ? (
                                new Date(workflowRun.updated_at).getTime() -
                                new Date(workflowRun.run_started_at).getTime()
                            ) / 1000
                            : 0,

                    logs:
                        workflowRun.display_title ||
                        "",

                    branch:
                        workflowRun.head_branch || "main",

                    commitMessage:
                        workflowRun.head_commit?.message ||
                        workflowRun.display_title ||
                        "",
                },
            });

            console.log(
                "♻️ Existing workflow updated"
            );

        } else {

            await prisma.testExecution.create({

                data: {

                    recordingId:
                        recording.id,

                    githubRunId:
                        workflowRun.id.toString(),

                    status:
                        workflowRun.conclusion === "success"
                            ? "PASSED"
                            : workflowRun.conclusion === "failure"
                                ? "FAILED"
                                : "RUNNING",

                    healedCount: 0,

                    duration:
                        workflowRun.run_started_at &&
                            workflowRun.updated_at
                            ? (
                                new Date(workflowRun.updated_at).getTime() -
                                new Date(workflowRun.run_started_at).getTime()
                            ) / 1000
                            : 0,

                    logs:
                        workflowRun.display_title ||
                        JSON.stringify(payload),

                    provider:
                        "GitHub Actions",

                    branch:
                        workflowRun.head_branch || "main",

                    environment:
                        "production",

                    repository:
                        payload.repository?.full_name || "",

                    workflowName:
                        workflowRun.name || "",

                    actor:
                        workflowRun.actor?.login || "",

                    commitMessage:
                        workflowRun.head_commit?.message ||
                        workflowRun.display_title ||
                        "",

                    commitHash:
                        workflowRun.head_sha || "",

                    buildNumber:
                        workflowRun.run_number
                            ? workflowRun.run_number.toString()
                            : "",
                },
            });

            console.log(
                "✅ New workflow execution saved"
            );


            io.emit("dashboard-updated");


            io.emit("pipeline-updated", {

                status:
                    workflowRun.conclusion === "success"
                        ? "PASSED"
                        : workflowRun.conclusion === "failure"
                            ? "FAILED"
                            : "RUNNING",

                workflow:
                    workflowRun.name,

                repository:
                    payload.repository?.full_name,

                branch:
                    workflowRun.head_branch,
            });
        }

        return res.json({

            success: true,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Webhook processing failed",
        });
    }
});

export default router;