import type{ Response } from "express"
import type{ AuthenticatedRequest } from "../../middleware/authmiddleware.js"

export function getMe(
  req: AuthenticatedRequest,
  res: Response
) {
  res.json({
    message: "Authenticated successfully",
    userId: req.userId
  })
}
