export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(password: string, stored: string): Promise<boolean>;
export declare function createAccessToken(payload: {
    sub: string;
    role: string;
    jti: string;
    exp: number;
}, secret: string): string;
export declare function verifyAccessToken(token: string, secret: string, now: number): {
    sub: string;
    role: string;
    jti: string;
    exp: number;
} | undefined;
