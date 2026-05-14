export interface IRunner {
	run(recordingId: string): Promise<any>;
	executeStep(step: any): Promise<boolean>;
	getAllRuns(): Promise<any[]>;
	getRun(id: string): Promise<any>;
}
