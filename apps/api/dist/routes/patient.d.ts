import { Router } from "express";
import { z } from "zod";
import type { AuthStore } from "../auth/store.js";
declare const intakeSchema: z.ZodObject<{
    mainReason: z.ZodString;
    currentConcerns: z.ZodString;
    emotionalChallenges: z.ZodString;
    relationshipChallenges: z.ZodString;
    workSchoolChallenges: z.ZodString;
    griefLoss: z.ZodString;
    faithRelatedConcerns: z.ZodString;
    previousProfessionalSupport: z.ZodString;
    preferredSupportApproach: z.ZodString;
    additionalInformation: z.ZodString;
    consentVersion: z.ZodString;
}, z.core.$strip>;
export type IntakeAnswers = z.infer<typeof intakeSchema>;
export type IntakeRecord = IntakeAnswers & {
    patientId: string;
};
export interface IntakeRepository {
    findByPatientId(patientId: string): Promise<IntakeRecord | undefined>;
    saveForPatient(patientId: string, input: IntakeAnswers): Promise<IntakeRecord>;
}
export declare class MongoIntakeRepository implements IntakeRepository {
    findByPatientId(patientId: string): Promise<IntakeRecord | undefined>;
    saveForPatient(patientId: string, input: IntakeAnswers): Promise<IntakeRecord>;
}
export declare function createPatientRouter(store: AuthStore, repository?: IntakeRepository, now?: () => number): Router;
export {};
