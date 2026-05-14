import { EventEmitter } from "events";

export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(): string {
	return Math.random().toString(36).substr(2, 9);
}

export function sanitizeInput(input: string): string {
	return input.replace(/[<>\"']/g, "");
}

export function parseJSON(jsonString: string): any {
	try {
		return JSON.parse(jsonString);
	} catch (error) {
		return null;
	}
}

export function redactSecrets(obj: any): any {
	if (typeof obj !== "object" || obj === null) return obj;

	const secrets = ["password", "token", "secret", "apiKey", "key"];
	const redacted = JSON.parse(JSON.stringify(obj));

	function traverse(current: any) {
		for (const key in current) {
			if (secrets.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
				current[key] = "***REDACTED***";
			} else if (typeof current[key] === "object") {
				traverse(current[key]);
			}
		}
	}

	traverse(redacted);
	return redacted;
}

export function isEmpty(value: any): boolean {
	return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

export function asyncEventEmitter(): EventEmitter {
	return new EventEmitter();
}

export default {
	delay,
	generateId,
	sanitizeInput,
	parseJSON,
	redactSecrets,
	isEmpty,
	asyncEventEmitter,
};
