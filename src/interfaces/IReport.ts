export interface IReport {
	generate(testRunId: string): Promise<string>;
	generateMarkdown(data: any): string;
	generateHTML(data: any): string;
	generateJSON(data: any): any;
}
