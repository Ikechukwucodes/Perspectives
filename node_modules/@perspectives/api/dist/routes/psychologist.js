import { Router } from "express";
import { requireAuth, requireRole } from "../auth/middleware.js";
export function createPsychologistRouter(store, now = () => Date.now()) {
    const router = Router();
    router.get("/me", requireAuth(store, now), requireRole("psychologist"), (request, response) => response.json({
        userId: request.auth.userId,
        role: "psychologist",
    }));
    return router;
}
