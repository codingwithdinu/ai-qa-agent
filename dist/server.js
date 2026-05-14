"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
/**
 * Environment Variables
 */
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
/**
 * Create HTTP Server
 */
const server = http_1.default.createServer(app_1.default);
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
process.on("unhandledRejection", (reason) => {
    console.error("❌ UNHANDLED REJECTION:", reason);
    shutdown();
});
/**
 * Handle Uncaught Exceptions
 */
process.on("uncaughtException", (error) => {
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
function shutdown() {
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
//# sourceMappingURL=server.js.map