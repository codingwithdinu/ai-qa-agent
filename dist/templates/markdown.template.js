"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMarkdownReport = buildMarkdownReport;
function buildMarkdownReport(title, content) {
    return `# ${title}

${content}
`;
}
exports.default = { buildMarkdownReport };
//# sourceMappingURL=markdown.template.js.map