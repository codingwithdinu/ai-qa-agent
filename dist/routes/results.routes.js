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
    const cleanedResults = folders
        .filter(folder => {
        const folderPath = path_1.default.join(resultsPath, folder);
        return fs_1.default.statSync(folderPath)
            .isDirectory();
    })
        .map(folder => {
        const folderPath = path_1.default.join(resultsPath, folder);
        let finalPath = folderPath;
        const nestedFolders = fs_1.default.readdirSync(folderPath)
            .filter(file => fs_1.default.statSync(path_1.default.join(folderPath, file)).isDirectory());
        if (nestedFolders.length > 0) {
            finalPath =
                path_1.default.join(folderPath, nestedFolders[0]);
        }
        const files = fs_1.default.readdirSync(finalPath);
        const stats = fs_1.default.statSync(finalPath);
        const screenshotFile = files.find(file => file.endsWith(".png"));
        const videoFile = files.find(file => file.endsWith(".webm"));
        const traceFile = files.find(file => file.endsWith(".zip"));
        return {
            id: folder,
            createdAt: stats.birthtime,
            screenshot: screenshotFile
                ? `http://localhost:5000/test-results/${folder}/${nestedFolders[0]}/${screenshotFile}`
                : null,
            video: videoFile
                ? `http://localhost:5000/test-results/${folder}/${nestedFolders[0]}/${videoFile}`
                : null,
            trace: traceFile
                ? `http://localhost:5000/test-results/${folder}/${nestedFolders[0]}/${traceFile}`
                : null,
        };
    })
        .sort((a, b) => new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime());
    return res.json(cleanedResults);
});
exports.default = router;
//# sourceMappingURL=results.routes.js.map