import { z } from "zod";
const consent = z.literal(true, {
    message: "Consent is required.",
});
const password = z.string().min(12).max(128);
export const patientRegistrationSchema = z
    .object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().email().max(254),
    password,
    confirmPassword: z.string(),
    dateOfBirth: z.string().date(),
    country: z.string().length(2),
    timezone: z.string().trim().min(1).max(80),
    termsConsent: consent,
    privacyConsent: consent,
    faithPreference: z
        .enum(["optional", "welcome", "prefer-not"])
        .default("optional"),
})
    .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match.",
});
export const psychologistRegistrationSchema = z
    .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().email().max(254),
    password,
    confirmPassword: z.string(),
    professionalTitle: z.string().trim().min(2).max(120),
    country: z.string().length(2),
    licenseInformation: z.string().trim().min(2).max(200),
    specializations: z.array(z.string().trim().min(1).max(80)).min(1).max(12),
    yearsOfExperience: z.number().int().min(0).max(70),
    faithCompatibility: z.enum([
        "open-to-discussion",
        "faith-integrated",
        "prefer-not",
    ]),
    termsConsent: consent,
    privacyConsent: consent,
    verificationAgreement: consent,
})
    .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match.",
});
export const loginSchema = z.object({
    email: z.string().email().max(254),
    password: z.string().min(1).max(128),
});
