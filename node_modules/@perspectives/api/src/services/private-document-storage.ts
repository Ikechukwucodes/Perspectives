import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

export type PrivateDocumentFile = {
  buffer: Buffer;
  extension: string;
};

export interface PrivateDocumentStorage {
  save(file: PrivateDocumentFile): Promise<{ storageKey: string }>;
  read(storageKey: string): Promise<Buffer>;
}

export class LocalPrivateDocumentStorage implements PrivateDocumentStorage {
  constructor(
    private readonly rootDirectory = join(process.cwd(), "private-documents"),
  ) {}

  async save(file: PrivateDocumentFile) {
    const storageKey = `${randomUUID()}${file.extension}`;
    const absolutePath = join(this.rootDirectory, storageKey);
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, file.buffer, { mode: 0o600 });
    return { storageKey };
  }

  async read(storageKey: string) {
    if (
      storageKey.includes("..") ||
      storageKey.includes("/") ||
      storageKey.includes("\\")
    ) {
      throw new Error("Invalid private document key.");
    }
    return readFile(join(this.rootDirectory, storageKey));
  }
}
