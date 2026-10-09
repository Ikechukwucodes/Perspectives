import { type AuthStore } from "./auth/store.js";
import { type IntakeRepository } from "./routes/patient.js";
import { type PsychologistApplicationRepository } from "./routes/psychologist-onboarding.js";
import { type VerifiedPsychologistRepository } from "./routes/public-psychologists.js";
import { type VerificationDocumentRepository } from "./routes/verification.js";
import type { PrivateDocumentStorage } from "./services/private-document-storage.js";
export declare function createApp(options?: {
    authStore?: AuthStore;
    patientRepository?: IntakeRepository;
    psychologistApplicationRepository?: PsychologistApplicationRepository;
    verifiedPsychologistRepository?: VerifiedPsychologistRepository;
    verificationDocumentRepository?: VerificationDocumentRepository;
    privateDocumentStorage?: PrivateDocumentStorage;
    now?: () => number;
}): import("express-serve-static-core").Express;
