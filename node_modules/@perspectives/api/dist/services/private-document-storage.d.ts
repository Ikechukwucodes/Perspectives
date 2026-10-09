export type PrivateDocumentFile = {
    buffer: Buffer;
    extension: string;
};
export interface PrivateDocumentStorage {
    save(file: PrivateDocumentFile): Promise<{
        storageKey: string;
    }>;
    read(storageKey: string): Promise<Buffer>;
}
export declare class LocalPrivateDocumentStorage implements PrivateDocumentStorage {
    private readonly rootDirectory;
    constructor(rootDirectory?: string);
    save(file: PrivateDocumentFile): Promise<{
        storageKey: string;
    }>;
    read(storageKey: string): Promise<NonSharedBuffer>;
}
