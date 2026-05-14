import http from "http";
import dotenv from "dotenv";
import routes from "./routes";
import app from "./app";

app.use("/api", routes);

dotenv.config();

/**
 * Environment Variables
 */
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Create HTTP Server
 */
const server = http.createServer(app);

/**
 * Start Server
 */
server.listen(PORT, () => {
  console.log("====================================");
  console.log("🚀 AI QA Agent Backend Started");
  console.log(`🌍 Environment : ${NODE_ENV}`);
  console.log(`📡 Server URL  : http://localhost:${PORT}`);
  console.log("====================================");
});

/**
 * Handle Unhandled Promise Rejections
 */
process.on("unhandledRejection", (reason: unknown) => {
  console.error("❌ UNHANDLED REJECTION:", reason);

  shutdown();
});

/**
 * Handle Uncaught Exceptions
 */
process.on("uncaughtException", (error: Error) => {
  console.error("❌ UNCAUGHT EXCEPTION:", error);

  shutdown();
});

/**
 * Graceful Shutdown
 */
process.on("SIGTERM", () => {
  console.log("⚠️ SIGTERM received");

  shutdown();
});

process.on("SIGINT", () => {
  console.log("⚠️ SIGINT received");

  shutdown();
});

/**
 * Shutdown Function
 */
function shutdown(): void {
  console.log("🛑 Shutting down server...");

  server.close(() => {
    console.log("✅ Server closed successfully");

    process.exit(1);
  });

  /**
   * Force shutdown if hanging
   */
  setTimeout(() => {
    console.error("❌ Forcefully shutting down");

    process.exit(1);
  }, 10000);
}