import argon2 from "argon2";
import prisma from "../../db/prisma.js";

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

}
export default new AuthService()