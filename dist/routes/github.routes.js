"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const github_service_1 = require("../services/github/github.service");
const router = (0, express_1.Router)();
router.get("/", async (_req, res) => {
    try {
        const runs = await (0, github_service_1.getWorkflowRuns)();
        res.json({
            success: true,
            runs,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.default = router;
//# sourceMappingURL=github.routes.js.map