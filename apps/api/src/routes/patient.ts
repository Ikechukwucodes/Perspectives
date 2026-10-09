import mongoose from "mongoose";
import { Router } from "express";
import { z } from "zod";
import {
  requireAuth,
  requireRole,
  type AuthenticatedRequest,
} from "../auth/middleware.js";
import type { AuthStore } from "../auth/store.js";
import { MentalHealthIntake } from "../database/models/index.js";

const text = z.string().trim().max(5000);
const intakeSchema = z.object({
  mainReason: text,
  currentConcerns: text,
  emotionalChallenges: text,
  relationshipChallenges: text,
  workSchoolChallenges: text,
  griefLoss: text,
  faithRelatedConcerns: text,
  previousProfessionalSupport: text,
  preferredSupportApproach: text,
  additionalInformation: text,
  consentVersion: z.string().trim().min(1).max(40),
});

export type IntakeAnswers = z.infer<typeof intakeSchema>;
export type IntakeRecord = IntakeAnswers & { patientId: string };

export interface IntakeRepository {
  findByPatientId(patientId: string): Promise<IntakeRecord | undefined>;
  saveForPatient(
    patientId: string,
    input: IntakeAnswers,
  ): Promise<IntakeRecord>;
}

function patientObjectId(patientId: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(patientId);
}

export class MongoIntakeRepository implements IntakeRepository {
  async findByPatientId(patientId: string): Promise<IntakeRecord | undefined> {
    const record = await MentalHealthIntake.findOne({
      patientId: patientObjectId(patientId),
    })
      .select("+responses")
      .lean();
    if (!record) return undefined;
    return {
      patientId,
      ...(record.responses as IntakeAnswers),
      consentVersion: record.consentVersion,
    };
  }

  async saveForPatient(
    patientId: string,
    input: IntakeAnswers,
  ): Promise<IntakeRecord> {
    await MentalHealthIntake.findOneAndUpdate(
      { patientId: patientObjectId(patientId) },
      {
        patientId: patientObjectId(patientId),
        responses: input,
        consentVersion: input.consentVersion,
        completedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    return { patientId, ...input };
  }
}

export function createPatientRouter(
  store: AuthStore,
  repository: IntakeRepository = new MongoIntakeRepository(),
  now: () => number = () => Date.now(),
): Router {
  const router = Router();
  const patientOnly = [requireAuth(store, now), requireRole("patient")];

  router.get(
    "/intake",
    ...patientOnly,
    async (request: AuthenticatedRequest, response, next) => {
      try {
        const intake = await repository.findByPatientId(request.auth!.userId);
        if (!intake)
          return response.status(404).json({ message: "Intake not found." });
        return response.json({ intake });
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    "/intake",
    ...patientOnly,
    async (request: AuthenticatedRequest, response, next) => {
      try {
        const intake = await repository.saveForPatient(
          request.auth!.userId,
          intakeSchema.parse(request.body),
        );
        return response.status(201).json({ intake });
      } catch (error) {
        return next(error);
      }
    },
  );

  return router;
}
