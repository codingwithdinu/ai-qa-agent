import { Router } from "express";
import fs from "fs";
import path from "path";
import prisma from "../config/database";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";


const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const resultsPath =
    path.join(process.cwd(), "test-results");

  if (!fs.existsSync(resultsPath)) {
    return res.json([]);
  }

  const recordings =
    await prisma.recording.findMany({

      where: {

        userId:
          req.userId!,
      },

      select: {

        id: true,
      },
    });

  const allowedIds =
    recordings.map(
      (r) => r.id
    );



  const folders =
    fs.readdirSync(resultsPath)

      .filter(folder =>

        allowedIds.includes(folder)

      );

  const baseUrl =
    `${req.protocol}://${req.get("host")}`;

  const findArtifact = (
    folderPath: string,
    extension: string
  ): string | null => {
    const stack = [folderPath];

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) continue;

      const entries = fs.readdirSync(current, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        const entryPath = path.join(
          current,
          entry.name
        );

        if (entry.isDirectory()) {
          stack.push(entryPath);
          continue;
        }

        if (
          entry.isFile() &&
          entry.name.endsWith(extension)
        ) {
          return entryPath;
        }
      }
    }

    return null;
  };

  const buildUrl = (filePath: string) =>
    `${baseUrl}/test-results/${path
      .relative(resultsPath, filePath)
      .replace(/\\/g, "/")}`;
  const cleanedResults = folders



    .filter(folder => {

      const folderPath =
        path.join(resultsPath, folder);

      return fs.statSync(folderPath)
        .isDirectory();

    })

    .map(folder => {

      const folderPath =
        path.join(resultsPath, folder);

      const stats =
        fs.statSync(folderPath);

      const screenshotPath =
        findArtifact(folderPath, ".png");

      const videoPath =
        findArtifact(folderPath, ".webm");

      const tracePath =
        findArtifact(folderPath, ".zip");

      return {

        id: folder,

        createdAt:
          stats.birthtime,

        screenshot:
          screenshotPath
            ? buildUrl(screenshotPath)
            : null,

        video:
          videoPath
            ? buildUrl(videoPath)
            : null,

        trace:
          tracePath
            ? buildUrl(tracePath)
            : null,

      };

    })

    .sort((a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );

  return res.json(cleanedResults);

});

export default router;