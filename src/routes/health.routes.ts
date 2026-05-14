import express from "express";

const router = express.Router();

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

export default router;
