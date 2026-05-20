"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEvents = processEvents;
exports.filterRedundantEvents = filterRedundantEvents;
const logger_1 = require("../../utils/logger");
/**
 * Process and normalize recording events
 */
function processEvents(rawEvents) {
    const processedEvents = [];
    let lastEventTime = Date.now();
    rawEvents.forEach((event) => {
        try {
            const timestamp = Date.now() - lastEventTime;
            lastEventTime = Date.now();
            if (event.type === "navigate") {
                processedEvents.push({
                    type: "navigate",
                    url: event.url,
                    timestamp,
                });
            }
            else if (event.type === "click") {
                processedEvents.push({
                    type: "click",
                    selector: event.selector,
                    x: event.x,
                    y: event.y,
                    timestamp,
                });
            }
            else if (event.type === "type") {
                processedEvents.push({
                    type: "type",
                    selector: event.selector,
                    text: event.text,
                    timestamp,
                });
            }
            else if (event.type === "wait") {
                processedEvents.push({
                    type: "wait",
                    ms: event.ms || 1000,
                    timestamp,
                });
            }
            else if (event.type === "screenshot") {
                processedEvents.push({
                    type: "screenshot",
                    timestamp,
                });
            }
        }
        catch (error) {
            logger_1.logger.warn("Error processing event", { event, error });
        }
    });
    logger_1.logger.info(`Processed ${processedEvents.length} events from ${rawEvents.length} raw events`);
    return processedEvents;
}
/**
 * Filter out redundant events
 */
function filterRedundantEvents(events) {
    const filtered = [];
    let lastEvent = null;
    events.forEach((event) => {
        // Skip duplicate consecutive events
        if (lastEvent && lastEvent.type === event.type && lastEvent.selector === event.selector) {
            return;
        }
        // Skip wait events shorter than 100ms
        if (event.type === "wait" && event.ms && event.ms < 100) {
            return;
        }
        filtered.push(event);
        lastEvent = event;
    });
    logger_1.logger.info(`Filtered events: ${events.length} -> ${filtered.length}`);
    return filtered;
}
exports.default = {
    processEvents,
    filterRedundantEvents,
};
//# sourceMappingURL=eventProcessor.js.map