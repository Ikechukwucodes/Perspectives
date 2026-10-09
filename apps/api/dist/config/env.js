import { resolve } from "node:path";
import dotenv from "dotenv";
import { z } from "zod";
export function getRootEnvPath() {
    return resolve(process.cwd(), "../../.env");
}
// Workspace scripts execute from apps/api, while the shared .env lives at the
// repository root. Load that file first in development/production, then allow
// an API-local .env to fill in values that are not already configured. Tests
// intentionally use schema defaults so local secrets cannot change assertions.
if (process.env.NODE_ENV !== "test") {
    dotenv.config({ path: getRootEnvPath() });
    dotenv.config();
}
const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
    API_PORT: z.coerce.number().int().positive().default(4000),
    WEB_ORIGIN: z.string().url().default("http://localhost:5174"),
    MONGODB_URI: z
        .string()
        .min(1)
        .default("mongodb://127.0.0.1:27017/perspectives"),
    AUTH_ACCESS_SECRET: z
        .string()
        .min(32)
        .default("development-access-secret-change-me-32chars"),
    AUTH_REFRESH_SECRET: z
        .string()
        .min(32)
        .default("development-refresh-secret-change-me"),
    ADMIN_BOOTSTRAP_KEY: z
        .string()
        .min(16)
        .default("development-bootstrap-key-change-me"),
});
export const env = envSchema.parse(process.env);
