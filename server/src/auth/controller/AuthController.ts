import type { Request, Response } from "express";
import AuthService from "../service/AuthService.js";
import { log } from "node:console";

export async function register(request:Request,response:Response){
    try{
        const {email,password}=request.body
        const user=await AuthService.register(email,password)

        response.status(201).json({message:"user created successfully", user});
    }catch(error){
        console.log(error)
        response.status(400).json({
            message: error instanceof Error ? error.message : "An error occurred"
        })
    }
    
}
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    const user = await AuthService.login(email, password)

    res.json({
      message: "Login successful",
      ...user
    })
  } catch (error) {
    console.error(error)

    res.status(401).json({
      message: "Invalid email or password"
    })
  }
}