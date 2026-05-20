"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_controller_1 = __importDefault(require("../controllers/test.controller"));
const router = (0, express_1.Router)();
/**
 * Run generated test
 */
router.post("/run", test_controller_1.default.runTest);
/**
 * Generate Playwright test from recording
 */
router.post("/generate/:recordingId", test_controller_1.default.generateTest);
/**
 * Execute generated Playwright test
 */
router.post("/execute/:recordingId", test_controller_1.default.executeTest);
/**
 * List all runs
 */
router.get("/", test_controller_1.default.listRuns);
/**
 * Get single run
 */
router.get("/:id", test_controller_1.default.getRun);
exports.default = router;
//# sourceMappingURL=test.routes.js.map