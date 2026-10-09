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
export declare function hashSessionToken(token: string): string;
export declare class InMemoryAuthStore implements AuthStore {
    private readonly users;
    private readonly sessions;
    private readonly revokedAccess;
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
export declare function toSafeUser(user: UserRecord): SafeUser;
