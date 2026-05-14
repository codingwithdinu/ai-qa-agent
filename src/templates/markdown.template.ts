export function buildMarkdownReport(title: string, content: string) {
	return `# ${title}

${content}
`;
}

export default { buildMarkdownReport };
