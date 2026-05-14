export interface IRecorder {
	start(sessionId: string): Promise<void>;
	stop(): Promise<void>;
	record(event: any): void;
	getEvents(): any[];
	clear(): void;
}
