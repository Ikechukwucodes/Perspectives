import type { NextFunction, Request, Response } from "express";
import type { AuthStore, UserRole } from "./store.js";
export type AuthContext = {
    userId: string;
    role: UserRole;
    jti: string;
};
export type AuthenticatedRequest = Request & {
    auth?: AuthContext;
};
export declare function requireAuth(store: AuthStore, now?: () => number): (request: AuthenticatedRequest, response: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare function requireRole(...roles: UserRole[]): (request: AuthenticatedRequest, response: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare function readCookie(request: Request, name: string): string | undefined;
