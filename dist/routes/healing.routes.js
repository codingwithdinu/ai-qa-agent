"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healingStore_1 = require("../services/healing/healingStore");
const router = (0, express_1.Router)();
router.get("/", (_req, res) => {
    const totalHealed = healingStore_1.healingHistory.length;
    const avgConfidence = totalHealed > 0
        ? Math.round(healingStore_1.healingHistory.reduce((sum, item) => sum + (item.confidence || 0), 0) / totalHealed)
        : 0;
    const avgDomSimilarity = totalHealed > 0
        ? Math.round(healingStore_1.healingHistory.reduce((sum, item) => sum + (item.domSimilarity || 0), 0) / totalHealed)
        : 0;
    const historyChart = healingStore_1.healingHistory.map((item, index) => ({
        step: `S${index + 1}`,
        healed: item.status === "Healed"
            ? 1
            : 0,
        confidence: item.confidence || 0,
    }));
    res.json({
        success: true,
        data: {
            latest: healingStore_1.healingHistory[0] || null,
            stats: {
                confidence: avgConfidence,
                domSimilarity: avgDomSimilarity,
                totalHealed,
            },
            historyChart,
            recommendations: healingStore_1.healingHistory.slice(0, 5),
            healingHistory: healingStore_1.healingHistory,
        },
    });
});
router.get("/export", async (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=healing-log.json");
    return res.send(JSON.stringify(healingStore_1.healingHistory, null, 2));
});
exports.default = router;
//# sourceMappingURL=healing.routes.js.map