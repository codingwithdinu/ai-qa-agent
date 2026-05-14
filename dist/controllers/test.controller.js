"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTest = runTest;
exports.listRuns = listRuns;
exports.getRun = getRun;
const runner_service_1 = __importDefault(require("../services/runner/runner.service"));
async function runTest(req, res) {
    try {
        const { recordingId } = req.body;
        if (!recordingId)
            return res.status(400).json({ success: false, message: "recordingId required" });
        const run = await runner_service_1.default.runRecording(recordingId);
        return res.status(200).json({ success: true, data: run });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message || "run failed" });
    }
}
async function listRuns(_req, res) {
    const runs = await runner_service_1.default.listRuns();
    return res.status(200).json({ success: true, data: runs });
}
async function getRun(req, res) {
    const { id } = req.params;
    const run = await runner_service_1.default.getRun(id);
    if (!run)
        return res.status(404).json({ success: false, message: "Run not found" });
    return res.status(200).json({ success: true, data: run });
}
exports.default = { runTest, listRuns, getRun };
//# sourceMappingURL=test.controller.js.map