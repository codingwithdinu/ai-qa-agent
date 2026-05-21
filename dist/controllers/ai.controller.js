"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const openai_service_1 = __importDefault(require("../services/ai/openai.service"));
async function generate(req, res) {
    try {
        const { prompt } = req.body;
        if (!prompt)
            return res.status(400).json({ success: false, message: "Missing prompt" });
        const result = await openai_service_1.default.generateFromOpenAI(prompt);
        return res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        console.error("AI generate error", err);
        return res.status(500).json({ success: false, message: err.message || "Internal error" });
    }
}
exports.default = { generate };
//# sourceMappingURL=ai.controller.js.map