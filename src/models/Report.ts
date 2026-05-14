export interface Report {
	id: string;
	testRunId: string;
	title: string;
	content: string;
	format: "markdown" | "html" | "json";
	createdAt: Date;
	updatedAt: Date;
	filePath?: string;
}

export const Reports: Report[] = [];

export default { Reports };
