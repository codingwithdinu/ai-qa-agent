import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);

export async function ensureDir(dirPath: string): Promise<void> {
	if (!fs.existsSync(dirPath)) {
		await mkdir(dirPath, { recursive: true });
	}
}

export async function saveFile(filePath: string, content: string | Buffer): Promise<void> {
	const dir = path.dirname(filePath);
	await ensureDir(dir);
	await writeFile(filePath, content);
	// Restrict file permissions for security (chmod 600)
	fs.chmodSync(filePath, 0o600);
}

export async function readFileContent(filePath: string): Promise<string> {
	return (await readFile(filePath)).toString();
}

export async function fileExists(filePath: string): Promise<boolean> {
	return new Promise((resolve) => {
		fs.exists(filePath, resolve);
	});
}

export async function deleteFile(filePath: string): Promise<void> {
	if (fs.existsSync(filePath)) {
		await unlink(filePath);
	}
}

export function getFileExtension(filename: string): string {
	return path.extname(filename).toLowerCase();
}

export function getFileName(filepath: string): string {
	return path.basename(filepath);
}

export function getFileSize(filePath: string): number {
	return fs.statSync(filePath).size;
}

export default {
	ensureDir,
	saveFile,
	readFileContent,
	fileExists,
	deleteFile,
	getFileExtension,
	getFileName,
	getFileSize,
};
