import { randomBytes, randomUUID } from "node:crypto";
import { Router } from "express";
import { env } from "../config/env.js";
import { createAccessToken, hashPassword, verifyPassword } from "./crypto.js";
import { requireAuth, readCookie, } from "./middleware.js";
import { loginSchema, patientRegistrationSchema, psychologistRegistrationSchema, } from "./schemas.js";
import { hashSessionToken, toSafeUser } from "./store.js";
const accessMaxAge = 15 * 60 * 1000;
const refreshMaxAge = 30 * 24 * 60 * 60 * 1000;
function setAuthCookies(response, accessToken, refreshToken) {
    const secure = env.NODE_ENV === "production" ? "; Secure" : "";
    response.setHeader("Set-Cookie", [
        `access_token=${accessToken}; Max-Age=900; Path=/; HttpOnly; SameSite=Lax${secure}`,
        `refresh_token=${refreshToken}; Max-Age=2592000; Path=/api/auth; HttpOnly; SameSite=Lax${secure}`,
    ]);
}
function clearAuthCookies(response) {
    response.setHeader("Set-Cookie", [
        "access_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax",
        "refresh_token=; Max-Age=0; Path=/api/auth; HttpOnly; SameSite=Lax",
    ]);
}
function genericDuplicate() {
    const error = Object.assign(new Error("Unable to create account with these details."), { status: 409 });
    return error;
}
function issueSession(store, userId, role, now, response) {
    const jti = randomUUID();
    const accessToken = createAccessToken({ sub: userId, role, jti, exp: now + accessMaxAge }, env.AUTH_ACCESS_SECRET);
    const refreshToken = randomBytes(48).toString("base64url");
    store.createSession({
        userId,
        tokenHash: hashSessionToken(refreshToken),
        expiresAt: now + refreshMaxAge,
    });
    setAuthCookies(response, accessToken, refreshToken);
}
export function createAuthRouter(store, now = () => Date.now()) {
    const router = Router();
    router.post("/register/patient", async (request, response, next) => {
        try {
            const input = patientRegistrationSchema.parse(request.body);
            if (store.findUserByEmail(input.email.toLowerCase()))
                throw genericDuplicate();
            const user = store.createUser({
                email: input.email.toLowerCase(),
                role: "patient",
                name: `${input.firstName} ${input.lastName}`,
                emailVerified: false,
                passwordHash: await hashPassword(input.password),
                profile: { ...input, password: undefined, confirmPassword: undefined },
            });
            issueSession(store, user.id, user.role, now(), response);
            return response.status(201).json({ user: toSafeUser(user) });
        }
        catch (error) {
            return next(error);
        }
    });
    router.post("/register/psychologist", async (request, response, next) => {
        try {
            const input = psychologistRegistrationSchema.parse(request.body);
            if (store.findUserByEmail(input.email.toLowerCase()))
                throw genericDuplicate();
            const user = store.createUser({
                email: input.email.toLowerCase(),
                role: "psychologist",
                name: input.name,
                emailVerified: false,
                passwordHash: await hashPassword(input.password),
                profile: { ...input, password: undefined, confirmPassword: undefined },
            });
            issueSession(store, user.id, user.role, now(), response);
            return response.status(201).json({ user: toSafeUser(user) });
        }
        catch (error) {
            return next(error);
        }
    });
    router.post("/admin/bootstrap", async (request, response, next) => {
        try {
            const input = request.body;
            const suppliedKey = request.header("x-admin-bootstrap-key") ?? input.bootstrapKey;
            if (suppliedKey !== env.ADMIN_BOOTSTRAP_KEY || store.hasRole("admin"))
                return response
                    .status(403)
                    .json({ message: "Admin bootstrap is not authorized." });
            if (typeof input.name !== "string" ||
                typeof input.email !== "string" ||
                typeof input.password !== "string")
                return response
                    .status(400)
                    .json({ message: "Please check the submitted information." });
            if (store.findUserByEmail(input.email.toLowerCase()))
                throw genericDuplicate();
            const user = store.createUser({
                email: input.email.toLowerCase(),
                role: "admin",
                name: input.name.trim(),
                emailVerified: true,
                passwordHash: await hashPassword(input.password),
                profile: {},
            });
            issueSession(store, user.id, user.role, now(), response);
            return response.status(201).json({ user: toSafeUser(user) });
        }
        catch (error) {
            return next(error);
        }
    });
    router.post("/login", async (request, response, next) => {
        try {
            const input = loginSchema.parse(request.body);
            const user = store.findUserByEmail(input.email.toLowerCase());
            if (!user || !(await verifyPassword(input.password, user.passwordHash)))
                return response
                    .status(401)
                    .json({ message: "Invalid email or password." });
            issueSession(store, user.id, user.role, now(), response);
            return response.json({ user: toSafeUser(user) });
        }
        catch (error) {
            return next(error);
        }
    });
    router.get("/me", requireAuth(store, now), (request, response) => {
        const user = request.auth && store.findUserById(request.auth.userId);
        if (!user)
            return response
                .status(401)
                .json({ message: "Authentication required." });
        return response.json({ user: toSafeUser(user) });
    });
    router.post("/logout", requireAuth(store, now), (request, response) => {
        const refresh = readCookie(request, "refresh_token");
        const session = refresh && store.findSession(hashSessionToken(refresh));
        if (session)
            store.revokeSession(session.id, now());
        if (request.auth)
            store.revokeAccess(request.auth.jti, now());
        clearAuthCookies(response);
        return response.status(204).send();
    });
    router.post("/refresh", (request, response) => {
        const refresh = readCookie(request, "refresh_token");
        const session = refresh && store.findSession(hashSessionToken(refresh));
        if (!session || session.revokedAt || session.expiresAt <= now())
            return response.status(401).json({ message: "Authentication required." });
        const user = store.findUserById(session.userId);
        if (!user)
            return response.status(401).json({ message: "Authentication required." });
        store.revokeSession(session.id, now());
        issueSession(store, user.id, user.role, now(), response);
        return response.json({ user: toSafeUser(user) });
    });
    router.post("/verify-email", (request, response) => response
        .status(501)
        .json({ message: "Email verification delivery is not configured yet." }));
    router.post("/password-reset/request", (request, response) => response.status(202).json({
        message: "If an account exists, reset instructions will be sent.",
    }));
    return router;
}
