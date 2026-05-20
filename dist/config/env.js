"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPENAI_API_KEY = exports.NODE_ENV = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const get = (key, fallback) => {
    const v = process.env[key];
    if (v === undefined)
        return fallback;
    return v;
};
exports.PORT = Number(get("PORT", "5000"));
exports.NODE_ENV = get("NODE_ENV", "development");
exports.OPENAI_API_KEY = get("OPENAI_API_KEY", "");
exports.default = {
    PORT: exports.PORT,
    NODE_ENV: exports.NODE_ENV,
    OPENAI_API_KEY: exports.OPENAI_API_KEY,
};
//# sourceMappingURL=env.js.map