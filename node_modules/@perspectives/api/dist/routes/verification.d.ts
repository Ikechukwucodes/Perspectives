import { z } from "zod";
import type { AuthStore } from "../auth/store.js";
import { type PrivateDocumentStorage } from "../services/private-document-storage.js";
declare const documentStatus: z.ZodEnum<{
    under_review: "under_review";
    rejected: "rejected";
    uploaded: "uploaded";
    accepted: "accepted";
}>;
export type VerificationDocumentStatus = z.infer<typeof documentStatus>;
export type VerificationDocumentRecord = {
    id: string;
    psychologistId: string;
    credentialId?: string;
    originalFilename: string;
    mimeType: string;
    sizeBytes: number;
    status: VerificationDocumentStatus;
    reviewedBy?: string;
    reviewedAt?: Date;
    reviewNotes?: string;
    storageKey?: string;
};
export interface VerificationDocumentRepository {
    create(input: Omit<VerificationDocumentRecord, "id" | "status">): Promise<VerificationDocumentRecord>;
    findById(id: string): Promise<VerificationDocumentRecord | undefined>;
    listForPsychologist(id: string): Promise<VerificationDocumentRecord[]>;
    updateStatus(id: string, status: VerificationDocumentStatus, reviewedBy: string, reviewNotes?: string): Promise<VerificationDocumentRecord | undefined>;
    addHistory(input: {
        documentId: string;
        actorId: string;
        fromStatus?: VerificationDocumentStatus;
        toStatus: VerificationDocumentStatus;
        notes?: string;
    }): Promise<unknown>;
}
export declare class MongoVerificationDocumentRepository implements VerificationDocumentRepository {
    create(input: Omit<VerificationDocumentRecord, "id" | "status">): Promise<{
        id: any;
        psychologistId: string;
        credentialId: any;
        originalFilename: string;
        mimeType: string;
        sizeBytes: number;
        status: "uploaded";
        storageKey: string | undefined;
    }>;
    findById(id: string): Promise<{
        id: any;
        psychologistId: any;
        credentialId: any;
        originalFilename: any;
        mimeType: any;
        sizeBytes: any;
        status: VerificationDocumentStatus;
        reviewedBy: any;
        reviewedAt: any;
        storageKey: any;
    } | undefined>;
    listForPsychologist(id: string): Promise<{
        id: any;
        psychologistId: string;
        credentialId: any;
        originalFilename: any;
        mimeType: any;
        sizeBytes: any;
        status: VerificationDocumentStatus;
        reviewedBy: any;
        reviewedAt: any;
    }[]>;
    updateStatus(id: string, status: VerificationDocumentStatus, reviewedBy: string, reviewNotes?: string): Promise<{
        id: any;
        psychologistId: any;
        credentialId: any;
        originalFilename: any;
        mimeType: any;
        sizeBytes: any;
        status: VerificationDocumentStatus;
        reviewedBy: string;
        reviewedAt: any;
        reviewNotes: string | undefined;
    } | undefined>;
    addHistory(input: {
        documentId: string;
        actorId: string;
        fromStatus?: VerificationDocumentStatus;
        toStatus: VerificationDocumentStatus;
        notes?: string;
    }): Promise<any>;
}
export declare function createPsychologistVerificationRouter(store: AuthStore, repository?: VerificationDocumentRepository, storage?: PrivateDocumentStorage, now?: () => number): import("express-serve-static-core").Router;
export declare function createAdminVerificationRouter(store: AuthStore, repository?: VerificationDocumentRepository, storage?: PrivateDocumentStorage, now?: () => number): import("express-serve-static-core").Router;
export {};
