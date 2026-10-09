import {
  createHmac,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(nodeScrypt);
const encoder = new TextEncoder();

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("base64url");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("base64url")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [, salt, encoded] = stored.split(":");
  if (!salt || !encoded) return false;
  const expected = Buffer.from(encoded, "base64url");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", encoder.encode(secret))
    .update(value)
    .digest("base64url");
}

export function createAccessToken(
  payload: { sub: string; role: string; jti: string; exp: number },
  secret: string,
): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifyAccessToken(
  token: string,
  secret: string,
  now: number,
): { sub: string; role: string; jti: string; exp: number } | undefined {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return undefined;
  const providedSignature = Buffer.from(signature);
  const expectedSignature = Buffer.from(sign(encoded, secret));
  if (
    providedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(providedSignature, expectedSignature)
  )
    return undefined;
  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString(),
    ) as { sub: string; role: string; jti: string; exp: number };
    return payload.exp > now ? payload : undefined;
  } catch {
    return undefined;
  }
}
