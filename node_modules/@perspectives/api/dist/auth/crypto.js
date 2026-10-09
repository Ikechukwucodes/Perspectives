import { createHmac, randomBytes, scrypt as nodeScrypt, timingSafeEqual, } from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(nodeScrypt);
const encoder = new TextEncoder();
export async function hashPassword(password) {
    const salt = randomBytes(16).toString("base64url");
    const derived = (await scrypt(password, salt, 64));
    return `scrypt:${salt}:${derived.toString("base64url")}`;
}
export async function verifyPassword(password, stored) {
    const [, salt, encoded] = stored.split(":");
    if (!salt || !encoded)
        return false;
    const expected = Buffer.from(encoded, "base64url");
    const actual = (await scrypt(password, salt, expected.length));
    return expected.length === actual.length && timingSafeEqual(expected, actual);
}
function sign(value, secret) {
    return createHmac("sha256", encoder.encode(secret))
        .update(value)
        .digest("base64url");
}
export function createAccessToken(payload, secret) {
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    return `${encoded}.${sign(encoded, secret)}`;
}
export function verifyAccessToken(token, secret, now) {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature)
        return undefined;
    const providedSignature = Buffer.from(signature);
    const expectedSignature = Buffer.from(sign(encoded, secret));
    if (providedSignature.length !== expectedSignature.length ||
        !timingSafeEqual(providedSignature, expectedSignature))
        return undefined;
    try {
        const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
        return payload.exp > now ? payload : undefined;
    }
    catch {
        return undefined;
    }
}
