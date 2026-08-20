import type{ Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET_KEY!

export interface AuthenticatedRequest extends Request {
  userId?: string
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required"
    })
  }

  const [scheme, token] = authHeader.split(" ")

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header"
    })
  }

  try {
    const payload = jwt.verify(
      token,
      ACCESS_TOKEN_SECRET
    )

    if (
      typeof payload === "string" ||
      payload.type !== "access" ||
      !payload.sub
    ) {
      return res.status(401).json({
        message: "Invalid access token"
      })
    }

    req.userId = payload.sub

    next()
  } catch {
    return res.status(401).json({
      message: "Invalid or expired access token"
    })
  }
}