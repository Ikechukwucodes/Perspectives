import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { verifyAccessToken } from "./crypto.js";
import type { AuthStore, UserRole } from "./store.js";

export type AuthContext = { userId: string; role: UserRole; jti: string };
export type AuthenticatedRequest = Request & { auth?: AuthContext };

function cookieValue(request: Request, name: string): string | undefined {
  const cookie = request.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return cookie?.slice(name.length + 1);
}

export function requireAuth(
  store: AuthStore,
  now: () => number = () => Date.now(),
) {
  return (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) => {
    const token = cookieValue(request, "access_token");
    const payload =
      token && verifyAccessToken(token, env.AUTH_ACCESS_SECRET, now());
    if (!payload || store.isAccessRevoked(payload.jti))
      return response.status(401).json({ message: "Authentication required." });
    request.auth = {
      userId: payload.sub,
      role: payload.role as UserRole,
      jti: payload.jti,
    };
    return next();
  };
}

export function requireRole(...roles: UserRole[]) {
  return (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) => {
    if (!request.auth || !roles.includes(request.auth.role))
      return response.status(403).json({
        message: "You do not have permission to access this resource.",
      });
    return next();
  };
}

export function readCookie(request: Request, name: string): string | undefined {
  return cookieValue(request, name);
}
