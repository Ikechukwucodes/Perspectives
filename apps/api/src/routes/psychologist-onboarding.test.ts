import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import type { VerifiedPsychologistRepository } from "./public-psychologists.js";
import type {
  PsychologistApplicationInput,
  PsychologistApplicationRecord,
  PsychologistApplicationRepository,
} from "./psychologist-onboarding.js";

const registration = {
  name: "Dr. Ada Stone",
  email: "ada@example.com",
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

const application: Omit<PsychologistApplicationInput, "status"> = {
  professionalTitle: "Clinical Psychologist",
  qualifications: [
    {
      qualification: "PhD",
      institution: "Example University",
      degree: "Psychology",
    },
  ],
  specializations: ["Anxiety", "Grief"],
  yearsOfExperience: 8,
  languages: ["English"],
  biography: "I offer compassionate, evidence-informed care.",
  licenseNumber: "LIC-12345",
  licensingOrganization: "State Board",
  country: "US",
  sessionTypes: ["Telehealth"],
  pricing: { currency: "USD", amount: 120, interval: "session" },
  availabilityPreferences: ["Weekday evenings"],
  faithCompatibility: "open-to-discussion",
  faithIntegrationApproach: "Optional and patient-led.",
  verificationDocumentIds: ["document-1"],
};

class TestApplicationRepository implements PsychologistApplicationRepository {
  private readonly records = new Map<string, PsychologistApplicationRecord>();

  async findByPsychologistId(id: string) {
    return this.records.get(id);
  }

  async saveForPsychologist(id: string, input: PsychologistApplicationInput) {
    const record = { psychologistId: id, ...input, status: "pending" as const };
    this.records.set(id, record);
    return record;
  }
}

class EmptyVerifiedRepository implements VerifiedPsychologistRepository {
  async listVerified() {
    return [];
  }
}

describe("psychologist onboarding", () => {
  it("submits a psychologist application as pending", async () => {
    const repository = new TestApplicationRepository();
    const app = createApp({
      psychologistApplicationRepository: repository,
      verifiedPsychologistRepository: new EmptyVerifiedRepository(),
    });
    const agent = request.agent(app);

    await agent.post("/api/auth/register/psychologist").send(registration);
    const submitted = await agent
      .post("/api/psychologist/application")
      .send(application);
    const dashboard = await agent.get("/api/psychologist/application");

    expect(submitted.status).toBe(201);
    expect(submitted.body.application.status).toBe("pending");
    expect(dashboard.body.application.status).toBe("pending");
    expect(dashboard.body.application.verificationStatus).not.toBe("verified");
  });

  it("does not expose a pending psychologist through public verified discovery", async () => {
    const repository = new TestApplicationRepository();
    const app = createApp({
      psychologistApplicationRepository: repository,
      verifiedPsychologistRepository: new EmptyVerifiedRepository(),
    });
    const agent = request.agent(app);

    await agent.post("/api/auth/register/psychologist").send(registration);
    await agent.post("/api/psychologist/application").send(application);

    const discovery = await request(app).get("/api/psychologists/discovery");

    expect(discovery.status).toBe(200);
    expect(discovery.body.psychologists).toEqual([]);
  });
});
