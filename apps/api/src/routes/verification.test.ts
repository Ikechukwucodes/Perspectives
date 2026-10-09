import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import type {
  VerificationDocumentRepository,
  VerificationDocumentRecord,
} from "./verification.js";
import type { PrivateDocumentStorage } from "../services/private-document-storage.js";

const psychologist = {
  name: "Dr. Ada Stone",
  email: "ada-verification@example.com",
  password: "StrongPass!123",
  confirmPassword: "StrongPass!123",
  professionalTitle: "Clinical Psychologist",
  country: "US",
  licenseInformation: "LIC-12345",
  specializations: ["Anxiety"],
  yearsOfExperience: 8,
  faithCompatibility: "open-to-discussion",
  termsConsent: true,
  privacyConsent: true,
  verificationAgreement: true,
};

class TestVerificationRepository implements VerificationDocumentRepository {
  private readonly records = new Map<string, VerificationDocumentRecord>();
  private nextId = 1;

  async create(input: Omit<VerificationDocumentRecord, "id" | "status">) {
    const record = {
      ...input,
      id: `document-${this.nextId++}`,
      status: "uploaded" as const,
    };
    this.records.set(record.id, record);
    return record;
  }

  async findById(id: string) {
    return this.records.get(id);
  }

  async listForPsychologist(psychologistId: string) {
    return [...this.records.values()].filter(
      (record) => record.psychologistId === psychologistId,
    );
  }

  async updateStatus(
    id: string,
    status: VerificationDocumentRecord["status"],
    reviewedBy: string,
    reviewNotes?: string,
  ) {
    const record = this.records.get(id);
    if (!record) return undefined;
    const updated = {
      ...record,
      status,
      reviewedBy,
      reviewNotes,
      reviewedAt: new Date(),
    };
    this.records.set(id, updated);
    return updated;
  }

  async addHistory() {
    return undefined;
  }
}

class TestPrivateStorage implements PrivateDocumentStorage {
  async save() {
    return { storageKey: "private/document-1" };
  }

  async read() {
    return Buffer.from("private document contents");
  }
}

async function createPsychologistAgent(app: ReturnType<typeof createApp>) {
  const agent = request.agent(app);
  await agent.post("/api/auth/register/psychologist").send(psychologist);
  return agent;
}

describe("private credential verification", () => {
  it("allows a psychologist to submit a validated document and keeps it private", async () => {
    const repository = new TestVerificationRepository();
    const app = createApp({
      verificationDocumentRepository: repository,
      privateDocumentStorage: new TestPrivateStorage(),
    });
    const agent = await createPsychologistAgent(app);

    const response = await agent
      .post("/api/psychologist/documents")
      .field("credentialType", "Professional license")
      .field("issuingBody", "State Board")
      .attach("document", Buffer.from("pdf bytes"), "license.pdf");

    expect(response.status).toBe(201);
    expect(response.body.document.status).toBe("uploaded");
    expect(response.body.document.storageKey).toBeUndefined();
    expect(response.body.message).toMatch(/not publicly accessible/i);
  });

  it("blocks a patient from reading a protected document", async () => {
    const repository = new TestVerificationRepository();
    const app = createApp({
      verificationDocumentRepository: repository,
      privateDocumentStorage: new TestPrivateStorage(),
    });
    const psychologistAgent = await createPsychologistAgent(app);
    const uploaded = await psychologistAgent
      .post("/api/psychologist/documents")
      .field("credentialType", "Professional license")
      .attach("document", Buffer.from("pdf bytes"), "license.pdf");

    const patientAgent = request.agent(app);
    await patientAgent.post("/api/auth/register/patient").send({
      firstName: "Patient",
      lastName: "One",
      email: "patient-verification@example.com",
      password: "StrongPass!123",
      confirmPassword: "StrongPass!123",
      dateOfBirth: "1990-01-01",
      country: "US",
      timezone: "UTC",
      termsConsent: true,
      privacyConsent: true,
    });

    const response = await patientAgent.get(
      `/api/admin/verification/documents/${uploaded.body.document.id}`,
    );
    expect(response.status).toBe(403);
  });

  it("lets an administrator download a document and records the decision history", async () => {
    const repository = new TestVerificationRepository();
    const app = createApp({
      verificationDocumentRepository: repository,
      privateDocumentStorage: new TestPrivateStorage(),
    });
    const psychologistAgent = await createPsychologistAgent(app);
    const uploaded = await psychologistAgent
      .post("/api/psychologist/documents")
      .field("credentialType", "Professional license")
      .attach("document", Buffer.from("pdf bytes"), "license.pdf");

    const adminAgent = request.agent(app);
    await adminAgent
      .post("/api/auth/admin/bootstrap")
      .set("x-admin-bootstrap-key", "development-bootstrap-key-change-me")
      .send({
        name: "Admin",
        email: "admin-verification@example.com",
        password: "StrongPass!123",
      });

    const download = await adminAgent.get(
      `/api/admin/verification/documents/${uploaded.body.document.id}`,
    );
    const decision = await adminAgent
      .patch(`/api/admin/verification/documents/${uploaded.body.document.id}`)
      .send({
        status: "under_review",
        reviewNotes: "Received for manual review.",
      });

    expect(download.status).toBe(200);
    expect(download.body.toString()).toContain("private document contents");
    expect(decision.status).toBe(200);
    expect(decision.body.document.status).toBe("under_review");
    expect(decision.body.history.status).toBe("under_review");
  });
});
