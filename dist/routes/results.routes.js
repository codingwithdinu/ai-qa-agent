"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("../config/database"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, async (req, res) => {
    const resultsPath = path_1.default.join(process.cwd(), "test-results");
    if (!fs_1.default.existsSync(resultsPath)) {
        return res.json([]);
    }
    const recordings = await database_1.default.recording.findMany({
        where: {
            userId: req.userId,
        },
        select: {
            id: true,
        },
    });
    const allowedIds = recordings.map((r) => r.id);
    const folders = fs_1.default.readdirSync(resultsPath)
        .filter(folder => allowedIds.includes(folder));
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const findArtifact = (folderPath, extension) => {
        const stack = [folderPath];
        while (stack.length > 0) {
            const current = stack.pop();
            if (!current)
                continue;
            const entries = fs_1.default.readdirSync(current, {
                withFileTypes: true,
            });
            for (const entry of entries) {
                const entryPath = path_1.default.join(current, entry.name);
                if (entry.isDirectory()) {
                    stack.push(entryPath);
                    continue;
                }
                if (entry.isFile() &&
                    entry.name.endsWith(extension)) {
                    return entryPath;
                }
            }
        }
        return null;
    };
    const buildUrl = (filePath) => `${baseUrl}/test-results/${path_1.default
        .relative(resultsPath, filePath)
        .replace(/\\/g, "/")}`;
    const cleanedResults = folders
        .filter(folder => {
        const folderPath = path_1.default.join(resultsPath, folder);
        return fs_1.default.statSync(folderPath)
            .isDirectory();
    })
        .map(folder => {
        const folderPath = path_1.default.join(resultsPath, folder);
        const stats = fs_1.default.statSync(folderPath);
        const screenshotPath = findArtifact(folderPath, ".png");
        const videoPath = findArtifact(folderPath, ".webm");
        const tracePath = findArtifact(folderPath, ".zip");
        return {
            id: folder,
            createdAt: stats.birthtime,
            screenshot: screenshotPath
                ? buildUrl(screenshotPath)
                : null,
            video: videoPath
                ? buildUrl(videoPath)
                : null,
            trace: tracePath
                ? buildUrl(tracePath)
                : null,
        };
    })
        .sort((a, b) => new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime());
    return res.json(cleanedResults);
});
exports.default = router;
//# sourceMappingURL=results.routes.js.map