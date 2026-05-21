"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDir = ensureDir;
exports.saveFile = saveFile;
exports.readFileContent = readFileContent;
exports.fileExists = fileExists;
exports.deleteFile = deleteFile;
exports.getFileExtension = getFileExtension;
exports.getFileName = getFileName;
exports.getFileSize = getFileSize;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const util_1 = require("util");
const writeFile = (0, util_1.promisify)(fs.writeFile);
const readFile = (0, util_1.promisify)(fs.readFile);
const mkdir = (0, util_1.promisify)(fs.mkdir);
const unlink = (0, util_1.promisify)(fs.unlink);
async function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
    }
}
async function saveFile(filePath, content) {
    const dir = path.dirname(filePath);
    await ensureDir(dir);
    await writeFile(filePath, content);
    // Restrict file permissions for security (chmod 600)
    fs.chmodSync(filePath, 0o600);
}
async function readFileContent(filePath) {
    return (await readFile(filePath)).toString();
}
async function fileExists(filePath) {
    return new Promise((resolve) => {
        fs.exists(filePath, resolve);
    });
}
async function deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
        await unlink(filePath);
    }
}
function getFileExtension(filename) {
    return path.extname(filename).toLowerCase();
}
function getFileName(filepath) {
    return path.basename(filepath);
}
function getFileSize(filePath) {
    return fs.statSync(filePath).size;
}
exports.default = {
    ensureDir,
    saveFile,
    readFileContent,
    fileExists,
    deleteFile,
    getFileExtension,
    getFileName,
    getFileSize,
};
//# sourceMappingURL=file.js.map