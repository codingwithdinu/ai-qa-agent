import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import prisma from "./config/database";
import aiRoutes from "./routes/ai.routes";
import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";
import recordRoutes from "./routes/record.routes";
import reportRoutes from "./routes/report.routes";
import testRoutes from "./routes/test.routes";
import { logger } from "./utils/logger";
import executionRoutes from "./routes/execution.routes";

const app: Application = express();

const publicDir = path.resolve(process.cwd(), "public");
const dashboardState = {
  isRunning: false,
  currentStep: "idle",
  progress: 0,
  message: "Ready",
  artifacts: {
    recording: false,
    cases: false,
    results: false,
    report: false,
  },
};

/**
 * Security Middleware
 */
app.use(helmet());

/**
 * Enable CORS
 */
app.use(cors());

/**
 * Logger Middleware
 */
app.use(morgan("dev"));

/**
 * Body Parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

/**
 * Serve Dashboard UI
 */
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/record", recordRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/test", testRoutes);
app.use("/api/executions", executionRoutes);

app.get("/api/state", async (_req: Request, res: Response) => {
  const recordingCount = await prisma.recording.count();
  const testRunCount = await prisma.testRun.count();
  const latestRun = await prisma.testRun.findFirst({
    orderBy: { startedAt: "desc" },
  });

  res.json({
    success: true,
    data: {
      ...dashboardState,
      artifacts: {
        recording: recordingCount > 0,
        cases: recordingCount > 0,
        results: testRunCount > 0,
        report: recordingCount > 0 || testRunCount > 0,
      },
      counts: {
        recordings: recordingCount,
        testRuns: testRunCount,
      },
      latestRunId: latestRun?.id || null,
    },
  });
});

app.get("/api/logs", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const pushLog = (entry: any) => {
    res.write(`data: ${JSON.stringify(entry)}\n\n`);
  };

  logger.on("log", pushLog);
  res.write(
    `data: ${JSON.stringify({ timestamp: new Date().toISOString(), level: "info", message: "Connected to log stream" })}\n\n`,
  );

  req.on("close", () => {
    logger.off("log", pushLog);
    res.end();
  });
});

/**
 * 404 Handler
 */
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
