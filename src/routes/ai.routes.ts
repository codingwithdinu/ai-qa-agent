import { Router } from "express";
import AIController from "../controllers/ai.controller";

const router = Router();

router.post("/generate", AIController.generate);

export default router;
