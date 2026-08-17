import jwt from "jsonwebtoken";

const secretKey =process.env.JWT_SECRET_KEY!

export function createAccessToken(userId: string): string {
    return jwt.sign({ userId,type:"access" }, secretKey, { expiresIn: "15min" });
}

