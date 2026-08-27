import type { Request, Response } from "express";
import AuthService from "../service/AuthService.js";

const REFRESH_TOKEN_COOKIE = "refreshToken"
const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth"
}

export async function register(req:Request,res:Response){
 
        const {email,password}=req.body
        const user=await AuthService.register(email,password)

        res.status(201).json({message:"user created successfully", user});
    
    
}
export async function login(req: Request, res: Response) {
    const { email, password } = req.body

    const user = await AuthService.login(email, password)
    const { refreshToken, ...response } = user

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshCookieOptions)

    res.json({
      message: "Login successful",
      ...response
    })
  
}
export async function refresh(req: Request, res: Response) {

    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE]
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required"
      })
    }

    const result = await AuthService.refresh(refreshToken)
    const { refreshToken: rotatedRefreshToken, ...response } = result

    res.cookie(REFRESH_TOKEN_COOKIE, rotatedRefreshToken, refreshCookieOptions)

    res.json(response)
  
}

export async function logout(req: Request, res: Response) {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE]

  if (refreshToken) {
    await AuthService.logout(refreshToken)
  }

  res.clearCookie(REFRESH_TOKEN_COOKIE, refreshCookieOptions)
  res.status(204).send()
}