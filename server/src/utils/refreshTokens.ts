import crypto from "node:crypto"
import argon2 from "argon2"

const SEPARATOR = "."

export function generateRefreshToken(): { token: string; selector: string; verifier: string } {
  const selector = crypto.randomBytes(16).toString("hex")
  const verifier = crypto.randomBytes(32).toString("hex")
  return { token: `${selector}${SEPARATOR}${verifier}`, selector, verifier }
}

export function parseRefreshToken(token: string): { selector: string; verifier: string } | null {
  const [selector, verifier] = token.split(SEPARATOR)
  if (!selector || !verifier) return null
  return { selector, verifier }
}

export async function hashVerifier(verifier: string): Promise<string> {
  return argon2.hash(verifier)
}

export async function verifyVerifier(verifier: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, verifier)
}