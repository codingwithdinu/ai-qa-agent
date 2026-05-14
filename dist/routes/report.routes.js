"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = __importDefault(require("../controllers/report.controller"));
const router = (0, express_1.Router)();
router.get("/markdown", report_controller_1.default.generateMarkdown);
exports.default = router;
//# sourceMappingURL=report.routes.js.map