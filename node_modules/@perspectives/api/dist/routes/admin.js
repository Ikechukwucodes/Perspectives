import { Router } from "express";
import { requireAuth, requireRole } from "../auth/middleware.js";
export function createAdminRouter(store, now = () => Date.now()) {
    const router = Router();
    router.get("/overview", requireAuth(store, now), requireRole("admin"), (_request, response) => response.json({ status: "admin-access-granted" }));
    return router;
}
