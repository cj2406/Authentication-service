import crypto from "node:crypto";
import argon2 from "argon2";

export function generateRefreshToken(): string {
    return crypto.randomBytes(64).toString("hex");
}
export async function hashRefreshToken(refreshToken: string): Promise<string> {
    return await argon2.hash(refreshToken);
}
export async function verifyRefreshToken(refreshToken: string, hashedRefreshToken: string): Promise<boolean> {
    return await argon2.verify(hashedRefreshToken, refreshToken);
}