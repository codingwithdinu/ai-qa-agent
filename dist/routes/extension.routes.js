"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
router.get("/download", (_req, res) => {
    const zipPath = path_1.default.resolve(process.cwd(), "extension.zip");
    if (!fs_1.default.existsSync(zipPath)) {
        return res.status(404).json({
            success: false,
            message: "Extension package not found",
        });
    }
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="ai-qa-recorder-extension.zip"');
    return res.sendFile(zipPath);
});
exports.default = router;
//# sourceMappingURL=extension.routes.js.map