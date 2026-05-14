"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMarkdown = generateMarkdown;
const markdown_template_1 = require("../templates/markdown.template");
const database_1 = __importDefault(require("../config/database"));
async function generateMarkdown(_req, res) {
    const title = "AI QA Report";
    const recs = await database_1.default.recording.findMany({});
    const content = recs.map((r) => `- Recording ${r.id} (${r.events.length} events)`).join("\n");
    const md = (0, markdown_template_1.buildMarkdownReport)(title, content);
    return res.status(200).json({ success: true, data: md });
}
exports.default = { generateMarkdown };
//# sourceMappingURL=report.controller.js.map