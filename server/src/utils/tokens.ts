import jwt from "jsonwebtoken"

const secretKey = process.env.JWT_SECRET_KEY

export function createAccessToken(userId: string): string {
  if (!secretKey) {
    throw new Error("JWT_SECRET_KEY is not configured")
  }

  return jwt.sign(
    {
      type: "access",
    },
    secretKey,
    {
      subject: userId,
      expiresIn: "15m",
    }
  )
}