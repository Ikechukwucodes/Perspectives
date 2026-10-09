import { Router } from "express";
export const healthRouter = Router();
healthRouter.get("/", (_request, response) => {
    const body = { status: "ok", service: "perspectives-api" };
    response.status(200).json(body);
});
