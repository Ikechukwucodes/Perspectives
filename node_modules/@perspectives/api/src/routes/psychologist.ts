import { Router } from "express";
import type { AuthenticatedRequest, AuthContext } from "../auth/middleware.js";
import { requireAuth, requireRole } from "../auth/middleware.js";
import type { AuthStore } from "../auth/store.js";

export function createPsychologistRouter(
  store: AuthStore,
  now: () => number = () => Date.now(),
): Router {
  const router = Router();
  router.get(
    "/me",
    requireAuth(store, now),
    requireRole("psychologist"),
    (request: AuthenticatedRequest, response) =>
      response.json({
        userId: (request.auth as AuthContext).userId,
        role: "psychologist",
      }),
  );
  return router;
}
