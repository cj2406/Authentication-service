import z from "zod"

export const registerSchema=z.object({
    email: z.email({error:"invalid email or password"}).trim().toLowerCase(),
    password: z.string().min(8,"password must be at least 8 characters").max(128,"password is too long")
})

export const loginSchema=z.object({
    email: z.email({error:"invalid email or password"}).trim().toLowerCase(),
    password: z.string().min(1,"passwordis required")
})

export type registerInput=z.infer<typeof registerSchema> 