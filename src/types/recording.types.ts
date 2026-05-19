export interface RecordingEvent {
	type: "navigate" | "click" | "type" | "wait" | "screenshot" | "refresh" | "input";
	selector?: string;
	text?: string;
	url?: string;
	ms?: number;
	timestamp: number;
	x?: number;
	y?: number;
	value?: string;
}

export interface RecordingSession {
	id: string;
	userId: string;
	url: string;
	events: RecordingEvent[];
	startedAt: Date;
	endedAt?: Date;
	browser: string;
}
