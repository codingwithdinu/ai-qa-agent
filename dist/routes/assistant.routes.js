"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", async (_req, res) => {
    try {
        const messages = [
            {
                id: "1",
                author: "AI",
                content: "2 flaky selectors healed automatically.",
            },
            {
                id: "2",
                author: "AI",
                content: "Pipeline stability improved by 11%.",
            },
        ];
        const suggestedActions = [
            "Generate release summary",
            "Analyze flaky tests",
            "Create CI risk report",
        ];
        res.json({
            success: true,
            data: messages,
            suggestedActions,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Assistant data failed",
        });
    }
});
exports.default = router;
//# sourceMappingURL=assistant.routes.js.map