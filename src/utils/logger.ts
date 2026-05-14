import * as fs from "fs";
import * as path from "path";
import { EventEmitter } from "events";

export interface LogEntry {
	timestamp: string;
	level: "debug" | "info" | "warn" | "error";
	message: string;
	meta?: unknown;
}

enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
}

class Logger extends EventEmitter {
	private logFile: string;
	private level: LogLevel;

	constructor(logFile = "./logs/app.log") {
		super();
		this.logFile = logFile;
		this.level = this.parseLogLevel(process.env.LOG_LEVEL || "INFO");
		this.ensureLogDir();
	}

	private ensureLogDir() {
		const dir = path.dirname(this.logFile);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
	}

	private parseLogLevel(level: string): LogLevel {
		const levelMap: { [key: string]: LogLevel } = {
			DEBUG: LogLevel.DEBUG,
			INFO: LogLevel.INFO,
			WARN: LogLevel.WARN,
			ERROR: LogLevel.ERROR,
		};
		return levelMap[level.toUpperCase()] || LogLevel.INFO;
	}

	private formatMessage(levelName: string, message: string, meta?: any): string {
		const timestamp = new Date().toISOString();
		let logEntry = `[${timestamp}] ${levelName}: ${message}`;

		if (meta) {
			try {
				logEntry += ` ${JSON.stringify(meta)}`;
			} catch {
				logEntry += ` ${String(meta)}`;
			}
		}

		return logEntry;
	}

	private writeLog(levelName: string, message: string, meta?: any) {
		const level = levelName.toLowerCase() as LogEntry["level"];
		const entry: LogEntry = {
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
		} catch (error) {
			console.error("Failed to write to log file:", error);
		}
	}

	debug(message: string, meta?: any) {
		if (this.level <= LogLevel.DEBUG) {
			this.writeLog("DEBUG", message, meta);
		}
	}

	info(message: string, meta?: any) {
		if (this.level <= LogLevel.INFO) {
			this.writeLog("INFO", message, meta);
		}
	}

	warn(message: string, meta?: any) {
		if (this.level <= LogLevel.WARN) {
			this.writeLog("WARN", message, meta);
		}
	}

	error(message: string, meta?: any) {
		if (this.level <= LogLevel.ERROR) {
			this.writeLog("ERROR", message, meta);
		}
	}
}

export const logger = new Logger();

export default logger;
