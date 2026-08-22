import type { Request, Response, NextFunction, RequestHandler } from "express"

// Wraps an async controller so that if it throws (or its promise
// rejects), the error is forwarded to next() instead of being lost.
export function catchAsync(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}