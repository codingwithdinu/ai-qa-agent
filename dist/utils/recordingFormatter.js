"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRecordingEvents = formatRecordingEvents;
function formatRecordingEvents(events) {
    return events.map((event, index) => {
        let action = "Unknown action";
        if (event.type === "click") {
            action =
                `Clicked element`;
        }
        if (event.type === "input" ||
            event.type === "type") {
            action =
                `Entered text`;
        }
        if (event.type === "navigate") {
            action =
                `Navigated to page`;
        }
        if (event.type === "refresh") {
            action =
                `Page refreshed`;
        }
        if (event.type === "wait") {
            action =
                `Waited`;
        }
        return {
            id: event.id ||
                `${index}`,
            action,
            selector: event.selector ||
                "No selector",
            value: event.value ||
                "",
            url: event.url ||
                "",
            timestamp: event.timestamp ||
                Date.now(),
            screenshot: event.screenshot ||
                null,
            duration: `${index + 1}s`,
            status: event.healed
                ? "healed"
                : event.aiOptimized
                    ? "optimized"
                    : "captured",
        };
    });
}
//# sourceMappingURL=recordingFormatter.js.map