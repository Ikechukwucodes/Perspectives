import { env } from "../config/env.js";
import { verifyAccessToken } from "./crypto.js";
function cookieValue(request, name) {
    const cookie = request.headers.cookie
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`));
    return cookie?.slice(name.length + 1);
}
export function requireAuth(store, now = () => Date.now()) {
    return (request, response, next) => {
        const token = cookieValue(request, "access_token");
        const payload = token && verifyAccessToken(token, env.AUTH_ACCESS_SECRET, now());
        if (!payload || store.isAccessRevoked(payload.jti))
            return response.status(401).json({ message: "Authentication required." });
        request.auth = {
            userId: payload.sub,
            role: payload.role,
            jti: payload.jti,
        };
        return next();
    };
}
export function requireRole(...roles) {
    return (request, response, next) => {
        if (!request.auth || !roles.includes(request.auth.role))
            return response.status(403).json({
                message: "You do not have permission to access this resource.",
            });
        return next();
    };
}
export function readCookie(request, name) {
    return cookieValue(request, name);
}
