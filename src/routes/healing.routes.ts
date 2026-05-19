import { Router } from "express";
import { healingHistory }
  from "../services/healing/healingStore";

const router = Router();

router.get("/", (_req, res) => {

  const totalHealed =
    healingHistory.length;

  const avgConfidence =
    totalHealed > 0
      ? Math.round(
        healingHistory.reduce(
          (sum, item) =>
            sum + (item.confidence || 0),
          0
        ) / totalHealed
      )
      : 0;

  const avgDomSimilarity =
    totalHealed > 0
      ? Math.round(
        healingHistory.reduce(
          (sum, item) =>
            sum + (item.domSimilarity || 0),
          0
        ) / totalHealed
      )
      : 0;

  const historyChart =
    healingHistory.map(
      (item, index) => ({

        step: `S${index + 1}`,

        healed:
          item.status === "Healed"
            ? 1
            : 0,

        confidence:
          item.confidence || 0,

      })
    );

  res.json({

    success: true,

    data: {

      latest:
        healingHistory[0] || null,

      stats: {

        confidence:
          avgConfidence,

        domSimilarity:
          avgDomSimilarity,

        totalHealed,

      },

      historyChart,

      recommendations:
        healingHistory.slice(0, 5),

      healingHistory,

    },

  });

});

router.get(
  "/export",
  async (_req, res) => {

    res.setHeader(
      "Content-Type",
      "application/json"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=healing-log.json"
    );

    return res.send(
      JSON.stringify(
        healingHistory,
        null,
        2
      )
    );
  }
);

export default router;