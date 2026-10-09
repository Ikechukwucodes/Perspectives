import { createHash, randomUUID } from "node:crypto";
import mongoose from "mongoose";
export function hashSessionToken(token) {
    return createHash("sha256").update(token).digest("hex");
}
export class InMemoryAuthStore {
    users = new Map();
    sessions = new Map();
    revokedAccess = new Map();
    findUserByEmail(email) {
        return [...this.users.values()].find((user) => user.email === email);
    }
    findUserById(id) {
        return this.users.get(id);
    }
    hasRole(role) {
        return [...this.users.values()].some((user) => user.role === role);
    }
    createUser(input) {
        const user = {
            ...input,
            id: new mongoose.Types.ObjectId().toString(),
            createdAt: new Date().toISOString(),
        };
        this.users.set(user.id, user);
        return user;
    }
    createSession(input) {
        const session = { ...input, id: randomUUID() };
        this.sessions.set(session.id, session);
        return session;
    }
    findSession(tokenHash) {
        return [...this.sessions.values()].find((session) => session.tokenHash === tokenHash);
    }
    revokeSession(id, at) {
        const session = this.sessions.get(id);
        if (session)
            session.revokedAt = at;
    }
    revokeAccess(jti, at) {
        this.revokedAccess.set(jti, at);
    }
    isAccessRevoked(jti) {
        return this.revokedAccess.has(jti);
    }
}
export function toSafeUser(user) {
    return Object.fromEntries(Object.entries(user).filter(([key]) => key !== "passwordHash"));
}
