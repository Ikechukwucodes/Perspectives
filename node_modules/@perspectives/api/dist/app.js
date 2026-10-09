import express from "express";
import pinoHttp from "pino-http";
import { errorHandler } from "./middleware/error-handler.js";
import { applySecurityMiddleware } from "./middleware/security.js";
import { healthRouter } from "./routes/health.js";
import { createAdminRouter } from "./routes/admin.js";
import { createAuthRouter } from "./auth/routes.js";
import { InMemoryAuthStore } from "./auth/store.js";
import { rateLimit } from "./middleware/rate-limit.js";
import { createPsychologistRouter } from "./routes/psychologist.js";
import { createPatientRouter, } from "./routes/patient.js";
import { createPsychologistOnboardingRouter, } from "./routes/psychologist-onboarding.js";
import { createPublicPsychologistsRouter, } from "./routes/public-psychologists.js";
import { createAdminVerificationRouter, createPsychologistVerificationRouter, } from "./routes/verification.js";
export function createApp(options = {}) {
    const app = express();
    const authStore = options.authStore ?? new InMemoryAuthStore();
    applySecurityMiddleware(app);
    app.use(express.json({ limit: "100kb" }));
    app.use(pinoHttp({
        redact: [
            "req.headers.authorization",
            "req.headers.cookie",
            "res.headers",
        ],
    }));
    app.use("/api/health", healthRouter);
    app.use("/api/auth", rateLimit(), createAuthRouter(authStore, options.now));
    app.use("/api/admin", createAdminRouter(authStore, options.now));
    app.use("/api/admin", createAdminVerificationRouter(authStore, options.verificationDocumentRepository, options.privateDocumentStorage, options.now));
    app.use("/api/psychologist", createPsychologistRouter(authStore, options.now));
    app.use("/api/psychologist", createPsychologistOnboardingRouter(authStore, options.psychologistApplicationRepository, options.now));
    app.use("/api/psychologist", createPsychologistVerificationRouter(authStore, options.verificationDocumentRepository, options.privateDocumentStorage, options.now));
    app.use("/api/psychologists", createPublicPsychologistsRouter(options.verifiedPsychologistRepository));
    app.use("/api/patient", createPatientRouter(authStore, options.patientRepository, options.now));
    app.use(errorHandler);
    return app;
}
