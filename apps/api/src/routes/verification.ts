import path from "node:path";
import { Router } from "express";
import formidable from "formidable";
import { z } from "zod";
import {
  requireAuth,
  requireRole,
  type AuthenticatedRequest,
} from "../auth/middleware.js";
import type { AuthStore } from "../auth/store.js";
import {
  Credential,
  VerificationDocument,
  VerificationHistory,
} from "../database/models/index.js";
import {
  LocalPrivateDocumentStorage,
  type PrivateDocumentStorage,
} from "../services/private-document-storage.js";

const allowedTypes = new Map([
  ["application/pdf", ".pdf"],
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
]);
const documentStatus = z.enum([
  "uploaded",
  "under_review",
  "accepted",
  "rejected",
]);
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
  credentialType?: string;
  issuingBody?: string;
  registrationNumber?: string;
  country?: string;
};

export interface VerificationDocumentRepository {
  create(
    input: Omit<VerificationDocumentRecord, "id" | "status">,
  ): Promise<VerificationDocumentRecord>;
  findById(id: string): Promise<VerificationDocumentRecord | undefined>;
  listForPsychologist(id: string): Promise<VerificationDocumentRecord[]>;
  updateStatus(
    id: string,
    status: VerificationDocumentStatus,
    reviewedBy: string,
    reviewNotes?: string,
  ): Promise<VerificationDocumentRecord | undefined>;
  addHistory(input: {
    documentId: string;
    actorId: string;
    fromStatus?: VerificationDocumentStatus;
    toStatus: VerificationDocumentStatus;
    notes?: string;
  }): Promise<unknown>;
}

function safeFilename(filename: string): string {
  return (
    path
      .basename(filename)
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 120) || "document"
  );
}

function publicDocument(record: VerificationDocumentRecord) {
  const { storageKey: _storageKey, ...safe } = record;
  return safe;
}

export class MongoVerificationDocumentRepository implements VerificationDocumentRepository {
  async create(input: Omit<VerificationDocumentRecord, "id" | "status">) {
    const credential = await Credential.create({
      psychologistId: input.psychologistId,
      credentialType: input.credentialType ?? "Submitted professional document",
      issuingBody: input.issuingBody,
      registrationNumber: input.registrationNumber,
      country: input.country,
      status: "pending",
    });
    const document = await VerificationDocument.create({
      ...input,
      credentialId: credential._id,
      status: "uploaded",
    });
    return {
      id: document._id.toString(),
      psychologistId: input.psychologistId,
      credentialId: credential._id.toString(),
      originalFilename: input.originalFilename,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      status: "uploaded" as const,
      storageKey: input.storageKey,
    };
  }

  async findById(id: string) {
    const document = await VerificationDocument.findById(id)
      .select("+storageKey")
      .lean();
    if (!document) return undefined;
    return {
      id: document._id.toString(),
      psychologistId: document.psychologistId.toString(),
      credentialId: document.credentialId?.toString(),
      originalFilename: document.originalFilename,
      mimeType: document.mimeType,
      sizeBytes: document.sizeBytes,
      status: document.status as VerificationDocumentStatus,
      reviewedBy: document.reviewedBy?.toString(),
      reviewedAt: document.reviewedAt,
      storageKey: document.storageKey,
    };
  }

  async listForPsychologist(id: string) {
    const documents = await VerificationDocument.find({
      psychologistId: id,
    }).lean();
    return documents.map((document) => ({
      id: document._id.toString(),
      psychologistId: id,
      credentialId: document.credentialId?.toString(),
      originalFilename: document.originalFilename,
      mimeType: document.mimeType,
      sizeBytes: document.sizeBytes,
      status: document.status as VerificationDocumentStatus,
      reviewedBy: document.reviewedBy?.toString(),
      reviewedAt: document.reviewedAt,
    }));
  }

  async updateStatus(
    id: string,
    status: VerificationDocumentStatus,
    reviewedBy: string,
    reviewNotes?: string,
  ) {
    const document = await VerificationDocument.findByIdAndUpdate(
      id,
      { status, reviewedBy, reviewedAt: new Date() },
      { new: true },
    ).lean();
    if (!document) return undefined;
    return {
      id: document._id.toString(),
      psychologistId: document.psychologistId.toString(),
      credentialId: document.credentialId?.toString(),
      originalFilename: document.originalFilename,
      mimeType: document.mimeType,
      sizeBytes: document.sizeBytes,
      status: document.status as VerificationDocumentStatus,
      reviewedBy,
      reviewedAt: document.reviewedAt,
      reviewNotes,
    };
  }

  async addHistory(input: {
    documentId: string;
    actorId: string;
    fromStatus?: VerificationDocumentStatus;
    toStatus: VerificationDocumentStatus;
    notes?: string;
  }) {
    return VerificationHistory.create(input);
  }
}

type FormidableFile = {
  filepath: string;
  mimetype: string | null;
  originalFilename: string | null;
  size: number;
};
type Fields = Record<string, string | string[] | undefined>;
type Files = Record<string, FormidableFile | FormidableFile[] | undefined>;
type ParsedUpload = { fields: Fields; file?: FormidableFile };

function parseUpload(request: AuthenticatedRequest): Promise<ParsedUpload> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024,
      maxFiles: 1,
      keepExtensions: false,
      uploadDir: process.env.TEMP,
    });
    form.parse(request, (error, fields: unknown, files: unknown) => {
      if (error) return reject(error);
      const parsedFields = fields as Fields;
      const candidate = (files as Files).document;
      return resolve({
        fields: parsedFields,
        file: Array.isArray(candidate) ? candidate[0] : candidate,
      });
    });
  });
}

function field(fields: Fields, name: string): string | undefined {
  const value = fields[name];
  return Array.isArray(value) ? value[0] : value;
}

function param(request: AuthenticatedRequest, name: string): string {
  const value = request.params[name];
  return Array.isArray(value) ? value[0] : value;
}

export function createPsychologistVerificationRouter(
  store: AuthStore,
  repository: VerificationDocumentRepository = new MongoVerificationDocumentRepository(),
  storage: PrivateDocumentStorage = new LocalPrivateDocumentStorage(),
  now: () => number = () => Date.now(),
) {
  const router = Router();
  router.post(
    "/documents",
    requireAuth(store, now),
    requireRole("psychologist"),
    async (request: AuthenticatedRequest, response, next) => {
      try {
        const parsed = await parseUpload(request);
        if (!parsed.file)
          return response
            .status(400)
            .json({ message: "A PDF, JPG or PNG document is required." });
        const mimeType = parsed.file.mimetype ?? "";
        const extension = allowedTypes.get(mimeType);
        if (!extension)
          return response
            .status(400)
            .json({ message: "This document type is not supported." });
        const { readFile } = await import("node:fs/promises");
        const buffer = await readFile(parsed.file.filepath);
        const saved = await storage.save({
          buffer,
          extension,
        });
        const document = await repository.create({
          psychologistId: request.auth!.userId,
          originalFilename: safeFilename(
            parsed.file.originalFilename ??
              field(parsed.fields, "filename") ??
              "document",
          ),
          mimeType,
          sizeBytes: parsed.file.size,
          storageKey: saved.storageKey,
          credentialType: field(parsed.fields, "credentialType"),
          issuingBody: field(parsed.fields, "issuingBody"),
          registrationNumber: field(parsed.fields, "registrationNumber"),
          country: field(parsed.fields, "country"),
        });
        return response.status(201).json({
          document: publicDocument(document),
          message:
            "Document submitted for private review. It is not publicly accessible.",
        });
      } catch (error) {
        return next(error);
      }
    },
  );
  router.get(
    "/documents",
    requireAuth(store, now),
    requireRole("psychologist"),
    async (request: AuthenticatedRequest, response, next) => {
      try {
        return response.json({
          documents: (
            await repository.listForPsychologist(request.auth!.userId)
          ).map(publicDocument),
        });
      } catch (error) {
        return next(error);
      }
    },
  );
  return router;
}

export function createAdminVerificationRouter(
  store: AuthStore,
  repository: VerificationDocumentRepository = new MongoVerificationDocumentRepository(),
  storage: PrivateDocumentStorage = new LocalPrivateDocumentStorage(),
  now: () => number = () => Date.now(),
) {
  const router = Router();
  const adminOnly = [requireAuth(store, now), requireRole("admin")];
  router.get(
    "/verification/documents/:documentId",
    ...adminOnly,
    async (request, response, next) => {
      try {
        const document = await repository.findById(
          param(request, "documentId"),
        );
        if (!document)
          return response.status(404).json({ message: "Document not found." });
        if (!document.storageKey)
          return response
            .status(404)
            .json({ message: "Document content is unavailable." });
        response
          .type(document.mimeType)
          .send(await storage.read(document.storageKey));
      } catch (error) {
        return next(error);
      }
    },
  );
  router.patch(
    "/verification/documents/:documentId",
    ...adminOnly,
    async (request: AuthenticatedRequest, response, next) => {
      try {
        const input = z
          .object({
            status: documentStatus,
            reviewNotes: z.string().trim().max(2000).optional(),
          })
          .parse(request.body);
        const documentId = param(request, "documentId");
        const existing = await repository.findById(documentId);
        if (!existing)
          return response.status(404).json({ message: "Document not found." });
        const document = await repository.updateStatus(
          documentId,
          input.status,
          request.auth!.userId,
          input.reviewNotes,
        );
        const history = await repository.addHistory({
          documentId,
          actorId: request.auth!.userId,
          fromStatus: existing.status,
          toStatus: input.status,
          notes: input.reviewNotes,
        });
        return response.json({
          document: publicDocument(document!),
          history: history ?? { status: input.status },
        });
      } catch (error) {
        return next(error);
      }
    },
  );
  return router;
}
