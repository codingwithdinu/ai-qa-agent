import { logger } from "../../utils/logger";
import { RecordingEvent } from "../../types/recording.types";

/**
 * Process and normalize recording events
 */
export function processEvents(rawEvents: any[]): RecordingEvent[] {
	const processedEvents: RecordingEvent[] = [];
	let lastEventTime = Date.now();

	rawEvents.forEach((event: any) => {
		try {
			const timestamp = Date.now() - lastEventTime;
			lastEventTime = Date.now();

			if (event.type === "navigate") {
				processedEvents.push({
					type: "navigate",
					url: event.url,
					timestamp,
				});
			} else if (event.type === "click") {
				processedEvents.push({
					type: "click",
					selector: event.selector,
					x: event.x,
					y: event.y,
					timestamp,
				});
			} else if (event.type === "type") {
				processedEvents.push({
					type: "type",
					selector: event.selector,
					text: event.text,
					timestamp,
				});
			} else if (event.type === "wait") {
				processedEvents.push({
					type: "wait",
					ms: event.ms || 1000,
					timestamp,
				});
			} else if (event.type === "screenshot") {
				processedEvents.push({
					type: "screenshot",
					timestamp,
				});
			}
		} catch (error: any) {
			logger.warn("Error processing event", { event, error });
		}
	});

	logger.info(`Processed ${processedEvents.length} events from ${rawEvents.length} raw events`);

	return processedEvents;
}

/**
 * Filter out redundant events
 */
export function filterRedundantEvents(events: RecordingEvent[]): RecordingEvent[] {
	const filtered: RecordingEvent[] = [];
	let lastEvent: RecordingEvent | null = null;

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

	logger.info(`Filtered events: ${events.length} -> ${filtered.length}`);

	return filtered;
}

export default {
	processEvents,
	filterRedundantEvents,
};
