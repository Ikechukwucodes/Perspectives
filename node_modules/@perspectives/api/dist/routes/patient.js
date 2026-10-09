import mongoose from "mongoose";
import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole, } from "../auth/middleware.js";
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
function patientObjectId(patientId) {
    return new mongoose.Types.ObjectId(patientId);
}
export class MongoIntakeRepository {
    async findByPatientId(patientId) {
        const record = await MentalHealthIntake.findOne({
            patientId: patientObjectId(patientId),
        })
            .select("+responses")
            .lean();
        if (!record)
            return undefined;
        return {
            patientId,
            ...record.responses,
            consentVersion: record.consentVersion,
        };
    }
    async saveForPatient(patientId, input) {
        await MentalHealthIntake.findOneAndUpdate({ patientId: patientObjectId(patientId) }, {
            patientId: patientObjectId(patientId),
            responses: input,
            consentVersion: input.consentVersion,
            completedAt: new Date(),
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        return { patientId, ...input };
    }
}
export function createPatientRouter(store, repository = new MongoIntakeRepository(), now = () => Date.now()) {
    const router = Router();
    const patientOnly = [requireAuth(store, now), requireRole("patient")];
    router.get("/intake", ...patientOnly, async (request, response, next) => {
        try {
            const intake = await repository.findByPatientId(request.auth.userId);
            if (!intake)
                return response.status(404).json({ message: "Intake not found." });
            return response.json({ intake });
        }
        catch (error) {
            return next(error);
        }
    });
    router.post("/intake", ...patientOnly, async (request, response, next) => {
        try {
            const intake = await repository.saveForPatient(request.auth.userId, intakeSchema.parse(request.body));
            return response.status(201).json({ intake });
        }
        catch (error) {
            return next(error);
        }
    });
    return router;
}
