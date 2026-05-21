import { Router } from "express";
import path from "path";
import fs from "fs";

const router = Router();

router.get("/download", (_req, res) => {
  const zipPath = path.resolve(
    process.cwd(),
    "extension.zip"
  );

  if (!fs.existsSync(zipPath)) {
    return res.status(404).json({
      success: false,
      message: "Extension package not found",
    });
  }

  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="ai-qa-recorder-extension.zip"'
  );
  return res.sendFile(zipPath);
});

export default router;
