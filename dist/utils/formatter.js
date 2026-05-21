"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.formatTime = formatTime;
exports.formatDuration = formatDuration;
exports.formatBytes = formatBytes;
exports.formatPercentage = formatPercentage;
exports.truncateString = truncateString;
function formatDate(date) {
    return date.toISOString().split("T")[0];
}
function formatTime(date) {
    return date.toISOString().split("T")[1].split(".")[0];
}
function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
    else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    else {
        return `${seconds}s`;
    }
}
function formatBytes(bytes) {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}
function formatPercentage(value, total) {
    const percentage = ((value / total) * 100).toFixed(2);
    return `${percentage}%`;
}
function truncateString(str, maxLength) {
    if (str.length <= maxLength)
        return str;
    return str.substring(0, maxLength - 3) + "...";
}
exports.default = {
    formatDate,
    formatTime,
    formatDuration,
    formatBytes,
    formatPercentage,
    truncateString,
};
//# sourceMappingURL=formatter.js.map