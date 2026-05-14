export interface IGenerator {
	generate(recordingId: string, options?: any): Promise<string>;
	generateCode(events: any[]): Promise<string>;
	generateTest(recordingId: string): Promise<any>;
}
