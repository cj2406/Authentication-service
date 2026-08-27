import argon2 from "argon2"
import prisma from "../../db/prisma.js"
import { createAccessToken } from "../../utils/tokens.js"
import { generateRefreshToken, parseRefreshToken, hashVerifier, verifyVerifier } from "../../utils/refreshTokens.js"
import { AppError } from "../../errors/AppError.js"

class AuthService {
  async register(email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      throw new AppError("An account with this email already exists", 409)
    }

    const passwordHash = await argon2.hash(password)
    const user = await prisma.user.create({
      data: { email, passwordHash }
    })

    return { id: user.id, email: user.email }
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new AppError("Invalid email or password", 401)

    const validPassword = await argon2.verify(user.passwordHash, password)
    if (!validPassword) throw new AppError("Invalid email or password", 401)

    const accessToken = createAccessToken(user.id)
    const { token, selector, verifier } = generateRefreshToken()
    const tokenHash = await hashVerifier(verifier)

    await prisma.refreshToken.create({
      data: {
        selector,
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    return {
      accessToken,
      refreshToken: token,
      user: { id: user.id, email: user.email }
    }
  }

  async refresh(refreshToken: string) {
    const parsed = parseRefreshToken(refreshToken)
    if (!parsed) throw new Error("Invalid refresh token")

    const storedToken = await prisma.refreshToken.findUnique({
      where: { selector: parsed.selector }
    })

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new Error("Invalid refresh token")
    }

    const valid = await verifyVerifier(parsed.verifier, storedToken.tokenHash)
    if (!valid) throw new Error("Invalid refresh token")

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() }
    })

    const accessToken = createAccessToken(storedToken.userId)
    const { token, selector, verifier } = generateRefreshToken()
    const tokenHash = await hashVerifier(verifier)

    await prisma.refreshToken.create({
      data: {
        selector,
        tokenHash,
        userId: storedToken.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    return { accessToken, refreshToken: token }
  }

  async logout(refreshToken: string): Promise<void> {
    const parsed = parseRefreshToken(refreshToken)
    if (!parsed) return

    const storedToken = await prisma.refreshToken.findUnique({
      where: { selector: parsed.selector }
    })

    if (!storedToken || storedToken.revokedAt) return

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() }
    })
  }
}

export default new AuthService()