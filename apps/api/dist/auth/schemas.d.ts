import { z } from "zod";
export declare const patientRegistrationSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    dateOfBirth: z.ZodString;
    country: z.ZodString;
    timezone: z.ZodString;
    termsConsent: z.ZodLiteral<true>;
    privacyConsent: z.ZodLiteral<true>;
    faithPreference: z.ZodDefault<z.ZodEnum<{
        optional: "optional";
        welcome: "welcome";
        "prefer-not": "prefer-not";
    }>>;
}, z.core.$strip>;
export declare const psychologistRegistrationSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    professionalTitle: z.ZodString;
    country: z.ZodString;
    licenseInformation: z.ZodString;
    specializations: z.ZodArray<z.ZodString>;
    yearsOfExperience: z.ZodNumber;
    faithCompatibility: z.ZodEnum<{
        "prefer-not": "prefer-not";
        "open-to-discussion": "open-to-discussion";
        "faith-integrated": "faith-integrated";
    }>;
    termsConsent: z.ZodLiteral<true>;
    privacyConsent: z.ZodLiteral<true>;
    verificationAgreement: z.ZodLiteral<true>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
