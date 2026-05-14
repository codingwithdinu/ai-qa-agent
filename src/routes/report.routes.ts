import { Router } from "express";
import ReportController from "../controllers/report.controller";

const router = Router();

router.get("/markdown", ReportController.generateMarkdown);

export default router;
