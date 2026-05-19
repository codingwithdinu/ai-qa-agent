import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import ReportController
  from "../controllers/report.controller";

const router = Router();

router.get(
  "/",
  authMiddleware,
  ReportController.getReports
);

export default router;