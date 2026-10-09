import type { NextFunction, Request, Response } from "express";
export declare function rateLimit(maximum?: number, windowMs?: number): (request: Request, response: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
