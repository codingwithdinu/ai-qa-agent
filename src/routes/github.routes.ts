import { Router } from "express";
import {
  getWorkflowRuns,
} from "../services/github/github.service";

const router = Router();

router.get("/", async (_req, res) => {

  try {

    const runs =
      await getWorkflowRuns();

    res.json({
      success: true,
      runs,
    });

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;