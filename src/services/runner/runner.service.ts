import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";
import prisma from "../../config/database";
import { chromium } from "playwright";

export async function runRecording(recordingId: string) {
  const rec = await prisma.recording.findUnique({ where: { id: recordingId } });

  if (!rec) throw new Error("Recording not found");

  const runId = uuid();

  const startedAt = new Date();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const steps: any[] = [];
  let success = true;

  try {
    const events = JSON.parse(rec.events || "[]") as any[];

    for (let i = 0; i < events.length; i++) {
      const ev = events[i];

      try {
        if (ev.type === "navigate" && ev.url) {
          await page.goto(ev.url, { waitUntil: "load" });
        } else if (ev.type === "click" && ev.selector) {
          await page.click(ev.selector);
        } else if (ev.type === "type" && ev.selector) {
          if (ev.text !== undefined) {
            await page.fill(ev.selector, ev.text);
          }
        } else if (ev.type === "wait" && ev.ms) {
          await page.waitForTimeout(ev.ms);
        } else {
          // unknown action - no-op
        }

        steps.push({
          index: i + 1,
          action: ev.type || "unknown",
          success: true,
        });
      } catch (stepErr: any) {
        success = false;
        steps.push({
          index: i + 1,
          action: ev.type || "unknown",
          success: false,
          error: String(stepErr),
        });
      }
    }
  } finally {
    await browser.close();
  }

  const finishedAt = new Date();

  const created = await prisma.testRun.create({
    data: {
      id: runId,
      recordingId,
      startedAt,
      finishedAt,
      success,
      steps: JSON.stringify(steps),
    },
  });

  return { ...created, steps };
}

export async function listRuns() {
  const runs = await prisma.testRun.findMany({
    orderBy: { startedAt: "desc" },
  });
  return runs.map((run: any) => ({
    ...run,
    steps: JSON.parse(run.steps || "[]"),
  }));
}

export async function getRun(id: string) {
  const run = await prisma.testRun.findUnique({ where: { id } });
  if (!run) return null;
  return { ...run, steps: JSON.parse(run.steps || "[]") };
}

export async function executeGeneratedTest(
  recordingId: string
): Promise<any> {

  return new Promise(async (resolve, reject) => {

    const startedAt = Date.now();

    try {

      const outputDir =
        `test-results/${recordingId}`;

      const command =
        `npx playwright test generated-tests/${recordingId}.spec.ts --output=${outputDir}`;


      const provider =
        process.env.CI_PROVIDER ||
        "Local Runner";

      const branch =
        process.env.GIT_BRANCH ||
        "main";

      const environment =
        process.env.NODE_ENV ||
        "development";

      const commitHash =
        process.env.GIT_COMMIT ||
        "local";

      const buildNumber =
        process.env.BUILD_NUMBER ||
        Date.now().toString();


      console.log("🚀 Running Test:");
      console.log(command);

      exec(command, async (
        error,
        stdout,
        stderr
      ) => {

        console.log("========== STDOUT ==========");
        console.log(stdout);

        console.log("========== STDERR ==========");
        console.log(stderr);

        const endedAt = Date.now();

        const duration =
          (endedAt - startedAt) / 1000;

        const healedCount =
          (
            stdout.match(
              /AI healed selector/g
            ) || []
          ).length +
          (
            stdout.match(
              /AI healed assertion/g
            ) || []
          ).length;

        const success = !error;

        await prisma.testExecution.create({

          data: {
            recordingId,
            status:
              success
                ? "PASSED"
                : "FAILED",
            healedCount,
            duration,
            provider,
            branch,
            environment,
            commitHash,
            buildNumber,
            logs:
              stdout + "\n" + stderr,
          },

        });

        if (error) {

          console.log("EXEC ERROR:");
          console.log(error);

          console.log("STDERR:");
          console.log(stderr);

          console.log("STDOUT:");
          console.log(stdout);

          return reject({

            success: false,

            message:
              stderr ||
              stdout ||
              error.message,

          });

        }

        resolve({

          success: true,

          output: stdout,

          healedCount,

          duration,

        });

      });

    } catch (error: any) {

      reject({

        success: false,

        message: error.message,

      });

    }

  });

}


export default {
  runRecording,
  listRuns,
  getRun,
  executeGeneratedTest,
};
