import { describe, expect, it } from "vitest";
import {
  Appointment,
  AuditLog,
  ChristianResource,
  Conversation,
  Credential,
  CrisisResource,
  MentalHealthIntake,
  Message,
  Notification,
  PatientProfile,
  Payment,
  Payout,
  PsychologistApplication,
  PsychologistProfile,
  Report,
  User,
  VerificationDocument,
} from "./models/index.js";

describe("PERSPECTIVES database models", () => {
  it("registers every core model with Mongoose", () => {
    expect([
      User,
      PatientProfile,
      PsychologistProfile,
      PsychologistApplication,
      Credential,
      VerificationDocument,
      MentalHealthIntake,
      Appointment,
      Conversation,
      Message,
      Notification,
      ChristianResource,
      CrisisResource,
      Report,
      AuditLog,
      Payment,
      Payout,
    ]).toHaveLength(17);
  });

  it("enforces user role and account-status enums", () => {
    const user = new User({
      firstName: "Test",
      lastName: "Patient",
      email: "patient@example.com",
      passwordHash: "hashed-value",
      role: "unknown",
      accountStatus: "unknown",
    });

    const error = user.validateSync();
    expect(error?.errors.role).toBeDefined();
    expect(error?.errors.accountStatus).toBeDefined();
  });

  it("defines privacy-sensitive indexes for discovery and scheduling", () => {
    expect(User.schema.indexes()).toContainEqual([
      { email: 1 },
      { unique: true },
    ]);
    expect(PsychologistProfile.schema.indexes()).toEqual(
      expect.arrayContaining([
        [{ verificationStatus: 1 }, {}],
        [{ specializations: 1 }, {}],
        [{ languages: 1 }, {}],
        [{ country: 1 }, {}],
      ]),
    );
    expect(Appointment.schema.indexes()).toEqual(
      expect.arrayContaining([
        [{ patientId: 1 }, {}],
        [{ psychologistId: 1 }, {}],
        [{ startTime: 1 }, {}],
        [{ status: 1 }, {}],
      ]),
    );
  });

  it("does not serialize a user password hash", () => {
    const user = new User({
      firstName: "Test",
      lastName: "Patient",
      email: "patient@example.com",
      passwordHash: "hashed-value",
      role: "patient",
      accountStatus: "active",
    });

    expect(user.toJSON()).not.toHaveProperty("passwordHash");
  });
});
