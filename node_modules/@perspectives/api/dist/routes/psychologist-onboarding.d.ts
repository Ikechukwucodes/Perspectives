import { Router } from "express";
import { z } from "zod";
import type { AuthStore } from "../auth/store.js";
declare const applicationSchema: z.ZodObject<{
    professionalTitle: z.ZodString;
    qualifications: z.ZodArray<z.ZodObject<{
        qualification: z.ZodString;
        institution: z.ZodString;
        degree: z.ZodString;
    }, z.core.$strip>>;
    specializations: z.ZodArray<z.ZodString>;
    yearsOfExperience: z.ZodNumber;
    languages: z.ZodArray<z.ZodString>;
    biography: z.ZodString;
    licenseNumber: z.ZodString;
    licensingOrganization: z.ZodString;
    country: z.ZodString;
    sessionTypes: z.ZodArray<z.ZodString>;
    pricing: z.ZodObject<{
        currency: z.ZodString;
        amount: z.ZodNumber;
        interval: z.ZodEnum<{
            session: "session";
            hour: "hour";
        }>;
    }, z.core.$strip>;
    availabilityPreferences: z.ZodArray<z.ZodString>;
    faithCompatibility: z.ZodString;
    faithIntegrationApproach: z.ZodString;
    verificationDocumentIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type PsychologistApplicationInput = z.infer<typeof applicationSchema>;
export type ApplicationStatus = "pending" | "under_review" | "more_information_required" | "verified" | "rejected" | "suspended";
export type PsychologistApplicationRecord = PsychologistApplicationInput & {
    psychologistId: string;
    status: ApplicationStatus;
};
export interface PsychologistApplicationRepository {
    findByPsychologistId(id: string): Promise<PsychologistApplicationRecord | undefined>;
    saveForPsychologist(id: string, input: PsychologistApplicationInput): Promise<PsychologistApplicationRecord>;
}
export declare class MongoPsychologistApplicationRepository implements PsychologistApplicationRepository {
    findByPsychologistId(id: string): Promise<{
        psychologistId: string;
        status: ApplicationStatus;
        professionalTitle: string;
        qualifications: {
            qualification: string;
            institution: string;
            degree: string;
        }[];
        specializations: string[];
        yearsOfExperience: number;
        languages: string[];
        biography: string;
        licenseNumber: string;
        licensingOrganization: string;
        country: string;
        sessionTypes: string[];
        pricing: {
            currency: string;
            amount: number;
            interval: "session" | "hour";
        };
        availabilityPreferences: string[];
        faithCompatibility: string;
        faithIntegrationApproach: string;
        verificationDocumentIds: string[];
    } | undefined>;
    saveForPsychologist(id: string, input: PsychologistApplicationInput): Promise<{
        psychologistId: string;
        status: "pending";
        professionalTitle: string;
        qualifications: {
            qualification: string;
            institution: string;
            degree: string;
        }[];
        specializations: string[];
        yearsOfExperience: number;
        languages: string[];
        biography: string;
        licenseNumber: string;
        licensingOrganization: string;
        country: string;
        sessionTypes: string[];
        pricing: {
            currency: string;
            amount: number;
            interval: "session" | "hour";
        };
        availabilityPreferences: string[];
        faithCompatibility: string;
        faithIntegrationApproach: string;
        verificationDocumentIds: string[];
    }>;
}
export declare function createPsychologistOnboardingRouter(store: AuthStore, repository?: PsychologistApplicationRepository, now?: () => number): Router;
export {};
