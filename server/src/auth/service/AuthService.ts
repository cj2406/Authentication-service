import argon2 from "argon2";
import prisma from "../../db/prisma.js";
import { createAccessToken } from "../../utils/tokens.js"
import { generateRefreshToken, hashRefreshToken, verifyRefreshToken } from "../../utils/refreshTokens.js";

class AuthService{
    async register(email:string, password:string) {
        const existingUser=await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(existingUser){
            throw new Error("user already exists")
        }

        const passwordHash=await argon2.hash(password)
        const user=await prisma.user.create({
            data:{
                email,
                passwordHash
            }
        })

        return {
            id:user.id,
            email:user.email
        }
        
    }

    async login(email:string, password:string){
        const user= await prisma.user.findUnique({
            where :{
                email
            }
        })

        if(!user){
            throw new Error("Invalid email or password")
        }
        const validPassword=await argon2.verify(
            user.passwordHash,
            password
        )

        if(!validPassword){
            throw new Error("Invalid email or password")
        }
       const accessToken = createAccessToken(user.id)

        const refreshToken = generateRefreshToken()
        const refreshTokenHash = await  hashRefreshToken(refreshToken)

        await prisma.refreshToken.create({
        data: {
            tokenHash: refreshTokenHash,
            userId: user.id,
            expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        }
        })

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email
            }
        }
    }
    async refresh(refreshToken: string) {
        const tokens = await prisma.refreshToken.findMany({
            where: {
            revokedAt: null,
            expiresAt: {
                gt: new Date()
            }
            }
        })

        let storedToken = null

        for (const token of tokens) {
            const valid = await verifyRefreshToken(
            refreshToken,
            token.tokenHash
            )

            if (valid) {
            storedToken = token
            break
            }
        }

        if (!storedToken) {
            throw new Error("Invalid refresh token")
        }

        // Revoke the token we just used
        await prisma.refreshToken.update({
            where: {
            id: storedToken.id
            },
            data: {
            revokedAt: new Date()
            }
        })
        const accessToken = createAccessToken(
            storedToken.userId
        )

        const newRefreshToken = generateRefreshToken()

        const newRefreshTokenHash = await hashRefreshToken(
            newRefreshToken
        )

        await prisma.refreshToken.create({
            data: {
            tokenHash: newRefreshTokenHash,
            userId: storedToken.userId,
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
            }
        })

        return {
            accessToken,
            refreshToken: newRefreshToken
        }
    }

}
export default new AuthService()