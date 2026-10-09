import { createHash, randomUUID } from "node:crypto";
import mongoose from "mongoose";

export type UserRole = "patient" | "psychologist" | "admin";

export type SafeUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  emailVerified: boolean;
  createdAt: string;
};

export type UserRecord = SafeUser & {
  passwordHash: string;
  profile: Record<string, unknown>;
};

export type RefreshSession = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: number;
  revokedAt?: number;
};

export interface AuthStore {
  findUserByEmail(email: string): UserRecord | undefined;
  findUserById(id: string): UserRecord | undefined;
  hasRole(role: UserRole): boolean;
  createUser(input: Omit<UserRecord, "id" | "createdAt">): UserRecord;
  createSession(input: Omit<RefreshSession, "id">): RefreshSession;
  findSession(tokenHash: string): RefreshSession | undefined;
  revokeSession(id: string, at: number): void;
  revokeAccess(jti: string, at: number): void;
  isAccessRevoked(jti: string): boolean;
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export class InMemoryAuthStore implements AuthStore {
  private readonly users = new Map<string, UserRecord>();
  private readonly sessions = new Map<string, RefreshSession>();
  private readonly revokedAccess = new Map<string, number>();

  findUserByEmail(email: string): UserRecord | undefined {
    return [...this.users.values()].find((user) => user.email === email);
  }

  findUserById(id: string): UserRecord | undefined {
    return this.users.get(id);
  }

  hasRole(role: UserRole): boolean {
    return [...this.users.values()].some((user) => user.role === role);
  }

  createUser(input: Omit<UserRecord, "id" | "createdAt">): UserRecord {
    const user: UserRecord = {
      ...input,
      id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date().toISOString(),
    };
    this.users.set(user.id, user);
    return user;
  }

  createSession(input: Omit<RefreshSession, "id">): RefreshSession {
    const session = { ...input, id: randomUUID() };
    this.sessions.set(session.id, session);
    return session;
  }

  findSession(tokenHash: string): RefreshSession | undefined {
    return [...this.sessions.values()].find(
      (session) => session.tokenHash === tokenHash,
    );
  }

  revokeSession(id: string, at: number): void {
    const session = this.sessions.get(id);
    if (session) session.revokedAt = at;
  }

  revokeAccess(jti: string, at: number): void {
    this.revokedAccess.set(jti, at);
  }

  isAccessRevoked(jti: string): boolean {
    return this.revokedAccess.has(jti);
  }
}

export function toSafeUser(user: UserRecord): SafeUser {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => key !== "passwordHash"),
  ) as SafeUser;
}
