import { Router } from "express";
import type { HealthResponse } from "@perspectives/shared";

export const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  const body: HealthResponse = { status: "ok", service: "perspectives-api" };
  response.status(200).json(body);
});
