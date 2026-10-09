import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (request, response, next) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      response.status(400).json({ error: "Invalid request body" });
      return;
    }

    request.body = result.data;
    next();
  };
}
