import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import type {
  IntakeAnswers,
  IntakeRecord,
  IntakeRepository,
} from "./patient.js";

const patient = {
  firstName: "Jordan",
  lastName: "Lee",
  email: "jordan@example.com",
  password: "StrongPass!123",
  confirmPassword: "StrongPass!123",
  dateOfBirth: "1992-03-14",
  country: "US",
  timezone: "America/New_York",
  termsConsent: true,
  privacyConsent: true,
  faithPreference: "optional",
};

class TestIntakeRepository implements IntakeRepository {
  private readonly records = new Map<string, IntakeRecord>();

  async findByPatientId(patientId: string) {
    return this.records.get(patientId);
  }

  async saveForPatient(patientId: string, input: IntakeAnswers) {
    const record: IntakeRecord = { patientId, ...input };
    this.records.set(patientId, record);
    return record;
  }
}

const intake = {
  mainReason: "I want support with a life transition.",
  currentConcerns: "Feeling overwhelmed.",
  emotionalChallenges: "Stress and uncertainty.",
  relationshipChallenges: "None to share.",
  workSchoolChallenges: "Balancing responsibilities.",
  griefLoss: "None to share.",
  faithRelatedConcerns: "Optional to discuss.",
  previousProfessionalSupport: "No.",
  preferredSupportApproach: "Reflective conversation.",
  additionalInformation: "I will share more when ready.",
  consentVersion: "2026-01",
};

describe("patient onboarding API", () => {
  it("stores and returns intake only for the authenticated patient", async () => {
    const repository = new TestIntakeRepository();
    const app = createApp({ patientRepository: repository });
    const agent = request.agent(app);

    await agent.post("/api/auth/register/patient").send(patient);
    const saved = await agent.post("/api/patient/intake").send(intake);
    const loaded = await agent.get("/api/patient/intake");

    expect(saved.status).toBe(201);
    expect(loaded.status).toBe(200);
    expect(loaded.body.intake).toMatchObject(intake);
    expect(loaded.body.intake.responses).toBeUndefined();
  });

  it("ignores a supplied patient id and cannot read another patient's intake", async () => {
    const repository = new TestIntakeRepository();
    const app = createApp({ patientRepository: repository });
    const patientA = request.agent(app);
    const patientB = request.agent(app);

    await patientA.post("/api/auth/register/patient").send(patient);
    await patientB
      .post("/api/auth/register/patient")
      .send({ ...patient, email: "casey@example.com" });
    await patientA.post("/api/patient/intake").send(intake);
    await patientB
      .post("/api/patient/intake")
      .send({ ...intake, mainReason: "Private patient B information." });

    const response = await patientA.get(
      "/api/patient/intake?patientId=patient-b",
    );

    expect(response.status).toBe(200);
    expect(response.body.intake.mainReason).toBe(intake.mainReason);
    expect(response.body.intake.mainReason).not.toContain("patient B");
  });
});
