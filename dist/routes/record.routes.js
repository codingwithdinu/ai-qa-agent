"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const record_controller_1 = __importDefault(require("../controllers/record.controller"));
const router = (0, express_1.Router)();
router.post("/", record_controller_1.default.createRecording);
router.get("/", record_controller_1.default.listRecordings);
exports.default = router;
//# sourceMappingURL=record.routes.js.map