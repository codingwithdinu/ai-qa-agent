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
exports.logger = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const events_1 = require("events");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
class Logger extends events_1.EventEmitter {
    constructor(logFile = "./logs/app.log") {
        super();
        this.logFile = logFile;
        this.level = this.parseLogLevel(process.env.LOG_LEVEL || "INFO");
        this.ensureLogDir();
    }
    ensureLogDir() {
        const dir = path.dirname(this.logFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    parseLogLevel(level) {
        const levelMap = {
            DEBUG: LogLevel.DEBUG,
            INFO: LogLevel.INFO,
            WARN: LogLevel.WARN,
            ERROR: LogLevel.ERROR,
        };
        return levelMap[level.toUpperCase()] || LogLevel.INFO;
    }
    formatMessage(levelName, message, meta) {
        const timestamp = new Date().toISOString();
        let logEntry = `[${timestamp}] ${levelName}: ${message}`;
        if (meta) {
            try {
                logEntry += ` ${JSON.stringify(meta)}`;
            }
            catch {
                logEntry += ` ${String(meta)}`;
            }
        }
        return logEntry;
    }
    writeLog(levelName, message, meta) {
        const level = levelName.toLowerCase();
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            meta,
        };
        const formatted = this.formatMessage(levelName, message, meta);
        console.log(formatted);
        this.emit("log", entry);
        try {
            fs.appendFileSync(this.logFile, formatted + "\n");
        }
        catch (error) {
            console.error("Failed to write to log file:", error);
        }
    }
    debug(message, meta) {
        if (this.level <= LogLevel.DEBUG) {
            this.writeLog("DEBUG", message, meta);
        }
    }
    info(message, meta) {
        if (this.level <= LogLevel.INFO) {
            this.writeLog("INFO", message, meta);
        }
    }
    warn(message, meta) {
        if (this.level <= LogLevel.WARN) {
            this.writeLog("WARN", message, meta);
        }
    }
    error(message, meta) {
        if (this.level <= LogLevel.ERROR) {
            this.writeLog("ERROR", message, meta);
        }
    }
}
exports.logger = new Logger();
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map