export function formatDate(date: Date): string {
	return date.toISOString().split("T")[0];
}

export function formatTime(date: Date): string {
	return date.toISOString().split("T")[1].split(".")[0];
}

export function formatDuration(ms: number): string {
	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	if (hours > 0) {
		return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
	} else if (minutes > 0) {
		return `${minutes}m ${seconds % 60}s`;
	} else {
		return `${seconds}s`;
	}
}

export function formatBytes(bytes: number): string {
	const units = ["B", "KB", "MB", "GB"];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function formatPercentage(value: number, total: number): string {
	const percentage = ((value / total) * 100).toFixed(2);
	return `${percentage}%`;
}

export function truncateString(str: string, maxLength: number): string {
	if (str.length <= maxLength) return str;
	return str.substring(0, maxLength - 3) + "...";
}

export default {
	formatDate,
	formatTime,
	formatDuration,
	formatBytes,
	formatPercentage,
	truncateString,
};
