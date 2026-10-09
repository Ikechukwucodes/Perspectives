import mongoose from "mongoose";
import { Router } from "express";
import { z } from "zod";
import {
  requireAuth,
  requireRole,
  type AuthenticatedRequest,
} from "../auth/middleware.js";
import type { AuthStore } from "../auth/store.js";
import { PsychologistApplication } from "../database/models/index.js";

const text = z.string().trim().min(1).max(5000);
const applicationSchema = z.object({
  professionalTitle: text.max(120),
  qualifications: z
    .array(
      z.object({
        qualification: text.max(200),
        institution: text.max(200),
        degree: text.max(200),
      }),
    )
    .min(1)
    .max(20),
  specializations: z.array(text.max(100)).min(1).max(20),
  yearsOfExperience: z.number().int().min(0).max(100),
  languages: z.array(text.max(80)).min(1).max(20),
  biography: text.max(4000),
  licenseNumber: text.max(200),
  licensingOrganization: text.max(200),
  country: z.string().length(2),
  sessionTypes: z.array(text.max(100)).min(1).max(10),
  pricing: z.object({
    currency: z.string().length(3),
    amount: z.number().min(0),
    interval: z.enum(["session", "hour"]),
  }),
  availabilityPreferences: z.array(text.max(100)).min(1).max(20),
  faithCompatibility: text.max(1000),
  faithIntegrationApproach: text.max(2000),
  verificationDocumentIds: z.array(z.string().min(1).max(200)).min(1).max(20),
});

export type PsychologistApplicationInput = z.infer<typeof applicationSchema>;
export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "more_information_required"
  | "verified"
  | "rejected"
  | "suspended";
export type PsychologistApplicationRecord = PsychologistApplicationInput & {
  psychologistId: string;
  status: ApplicationStatus;
};

export interface PsychologistApplicationRepository {
  findByPsychologistId(
    id: string,
  ): Promise<PsychologistApplicationRecord | undefined>;
  saveForPsychologist(
    id: string,
    input: PsychologistApplicationInput,
  ): Promise<PsychologistApplicationRecord>;
}

export class MongoPsychologistApplicationRepository implements PsychologistApplicationRepository {
  async findByPsychologistId(id: string) {
    const record = await PsychologistApplication.findOne({
      psychologistId: new mongoose.Types.ObjectId(id),
    }).lean();
    if (!record) return undefined;
    return {
      ...(record as unknown as PsychologistApplicationInput),
      psychologistId: id,
      status: record.status as ApplicationStatus,
    };
  }

  async saveForPsychologist(id: string, input: PsychologistApplicationInput) {
    const record = await PsychologistApplication.findOneAndUpdate(
      { psychologistId: new mongoose.Types.ObjectId(id) },
      {
        ...input,
        psychologistId: new mongoose.Types.ObjectId(id),
        status: "pending",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();
    return {
      ...(record as unknown as PsychologistApplicationInput),
      psychologistId: id,
      status: "pending" as const,
    };
  }
}

export function createPsychologistOnboardingRouter(
  store: AuthStore,
  repository: PsychologistApplicationRepository = new MongoPsychologistApplicationRepository(),
  now: () => number = () => Date.now(),
): Router {
  const router = Router();
  const psychologistOnly = [
    requireAuth(store, now),
    requireRole("psychologist"),
  ];

  router.get(
    "/application",
    ...psychologistOnly,
    async (request: AuthenticatedRequest, response, next) => {
      try {
        const application = await repository.findByPsychologistId(
          request.auth!.userId,
        );
        if (!application)
          return response
            .status(404)
            .json({ message: "Application not found." });
        return response.json({
          application,
          message: "Your application is under review.",
        });
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    "/application",
    ...psychologistOnly,
    async (request: AuthenticatedRequest, response, next) => {
      try {
        const application = await repository.saveForPsychologist(
          request.auth!.userId,
          applicationSchema.parse(request.body),
        );
        return response
          .status(201)
          .json({ application, message: "Your application is under review." });
      } catch (error) {
        return next(error);
      }
    },
  );

  return router;
}
