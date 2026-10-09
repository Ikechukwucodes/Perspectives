import { Router } from "express";
import type { AuthStore } from "../auth/store.js";
import { requireAuth, requireRole } from "../auth/middleware.js";

export function createAdminRouter(
  store: AuthStore,
  now: () => number = () => Date.now(),
): Router {
  const router = Router();
  router.get(
    "/overview",
    requireAuth(store, now),
    requireRole("admin"),
    (_request, response) => response.json({ status: "admin-access-granted" }),
  );
  return router;
}
