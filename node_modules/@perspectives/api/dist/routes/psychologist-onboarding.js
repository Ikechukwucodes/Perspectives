import mongoose from "mongoose";
import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole, } from "../auth/middleware.js";
import { PsychologistApplication } from "../database/models/index.js";
const text = z.string().trim().min(1).max(5000);
const applicationSchema = z.object({
    professionalTitle: text.max(120),
    qualifications: z
        .array(z.object({
        qualification: text.max(200),
        institution: text.max(200),
        degree: text.max(200),
    }))
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
export class MongoPsychologistApplicationRepository {
    async findByPsychologistId(id) {
        const record = await PsychologistApplication.findOne({
            psychologistId: new mongoose.Types.ObjectId(id),
        }).lean();
        if (!record)
            return undefined;
        return {
            ...record,
            psychologistId: id,
            status: record.status,
        };
    }
    async saveForPsychologist(id, input) {
        const record = await PsychologistApplication.findOneAndUpdate({ psychologistId: new mongoose.Types.ObjectId(id) }, {
            ...input,
            psychologistId: new mongoose.Types.ObjectId(id),
            status: "pending",
        }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
        return {
            ...record,
            psychologistId: id,
            status: "pending",
        };
    }
}
export function createPsychologistOnboardingRouter(store, repository = new MongoPsychologistApplicationRepository(), now = () => Date.now()) {
    const router = Router();
    const psychologistOnly = [
        requireAuth(store, now),
        requireRole("psychologist"),
    ];
    router.get("/application", ...psychologistOnly, async (request, response, next) => {
        try {
            const application = await repository.findByPsychologistId(request.auth.userId);
            if (!application)
                return response
                    .status(404)
                    .json({ message: "Application not found." });
            return response.json({
                application,
                message: "Your application is under review.",
            });
        }
        catch (error) {
            return next(error);
        }
    });
    router.post("/application", ...psychologistOnly, async (request, response, next) => {
        try {
            const application = await repository.saveForPsychologist(request.auth.userId, applicationSchema.parse(request.body));
            return response
                .status(201)
                .json({ application, message: "Your application is under review." });
        }
        catch (error) {
            return next(error);
        }
    });
    return router;
}
