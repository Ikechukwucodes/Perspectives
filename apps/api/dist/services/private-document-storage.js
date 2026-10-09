import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
export class LocalPrivateDocumentStorage {
    rootDirectory;
    constructor(rootDirectory = join(process.cwd(), "private-documents")) {
        this.rootDirectory = rootDirectory;
    }
    async save(file) {
        const storageKey = `${randomUUID()}${file.extension}`;
        const absolutePath = join(this.rootDirectory, storageKey);
        await mkdir(dirname(absolutePath), { recursive: true });
        await writeFile(absolutePath, file.buffer, { mode: 0o600 });
        return { storageKey };
    }
    async read(storageKey) {
        if (storageKey.includes("..") ||
            storageKey.includes("/") ||
            storageKey.includes("\\")) {
            throw new Error("Invalid private document key.");
        }
        return readFile(join(this.rootDirectory, storageKey));
    }
}
