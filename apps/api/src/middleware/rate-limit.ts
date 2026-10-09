import type { NextFunction, Request, Response } from "express";

export function rateLimit(maximum = 30, windowMs = 60_000) {
  const attempts = new Map<string, { count: number; resetAt: number }>();
  return (request: Request, response: Response, next: NextFunction) => {
    const key = request.ip ?? "unknown";
    const now = Date.now();
    const current = attempts.get(key);
    if (!current || current.resetAt <= now)
      attempts.set(key, { count: 1, resetAt: now + windowMs });
    else current.count += 1;
    const entry = attempts.get(key)!;
    response.setHeader("RateLimit-Limit", maximum);
    response.setHeader(
      "RateLimit-Remaining",
      Math.max(0, maximum - entry.count),
    );
    if (entry.count > maximum)
      return response
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    return next();
  };
}
