import cors from "cors";
import helmet from "helmet";
import type { Express } from "express";
import { env } from "../config/env.js";

export function applySecurityMiddleware(app: Express): void {
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        const localDevelopmentOrigin =
          env.NODE_ENV !== "production" &&
          /^http:\/\/localhost:(5173|5174)$/.test(origin ?? "");
        if (!origin || origin === env.WEB_ORIGIN || localDevelopmentOrigin) {
          callback(null, origin ?? env.WEB_ORIGIN);
          return;
        }
        callback(new Error("Origin is not allowed by CORS."));
      },
      credentials: true,
    }),
  );
}
