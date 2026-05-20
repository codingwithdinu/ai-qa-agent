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

      let finalPath = folderPath;

      const nestedFolders =
        fs.readdirSync(folderPath)
          .filter(file =>
            fs.statSync(
              path.join(folderPath, file)
            ).isDirectory()
          );

      if (nestedFolders.length > 0) {

        finalPath =
          path.join(
            folderPath,
            nestedFolders[0]
          );

      }

      const files =
        fs.readdirSync(finalPath);

      const stats =
        fs.statSync(finalPath);

      const screenshotFile =
        files.find(file =>
          file.endsWith(".png")
        );

      const videoFile =
        files.find(file =>
          file.endsWith(".webm")
        );

      const traceFile =
        files.find(file =>
          file.endsWith(".zip")
        );

      return {

        id: folder,

        createdAt:
          stats.birthtime,

        screenshot:
          screenshotFile
            ? `https://ai-qa-agent-1.onrender.com/test-results/${folder}/${nestedFolders[0]}/${screenshotFile}`
            : null,

        video:
          videoFile
            ? `https://ai-qa-agent-1.onrender.com/test-results/${folder}/${nestedFolders[0]}/${videoFile}`
            : null,

        trace:
          traceFile
            ? `https://ai-qa-agent-1.onrender.com/test-results/${folder}/${nestedFolders[0]}/${traceFile}`
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