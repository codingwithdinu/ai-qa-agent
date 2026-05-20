"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**
 * GET /health
 * Health check endpoint
 */
router.get("/", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
    });
});
/**
 * GET /health/ready
 * Readiness probe for orchestration
 */
router.get("/ready", (req, res) => {
    res.json({
        ready: true,
        timestamp: new Date().toISOString(),
    });
});
/**
 * GET /health/live
 * Liveness probe for orchestration
 */
router.get("/live", (req, res) => {
    res.json({
        live: true,
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
//# sourceMappingURL=health.routes.js.map