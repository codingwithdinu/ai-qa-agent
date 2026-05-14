"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecording = createRecording;
exports.listRecordings = listRecordings;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
async function createRecording(req, res) {
    const { events, sessionId } = req.body;
    if (!events || !Array.isArray(events))
        return res.status(400).json({ success: false, message: "events array required" });
    // persist to database
    const created = await database_1.default.recording.create({
        data: {
            id: (0, uuid_1.v4)(),
            sessionId: sessionId || null,
            events: events,
        },
    });
    return res.status(201).json({ success: true, data: created });
}
async function listRecordings(_req, res) {
    const recs = await database_1.default.recording.findMany({ orderBy: { createdAt: 'desc' } });
    return res.status(200).json({ success: true, data: recs });
}
exports.default = { createRecording, listRecordings };
//# sourceMappingURL=record.controller.js.map