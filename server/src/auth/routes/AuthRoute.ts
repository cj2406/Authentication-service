import { Router } from "express";
import { register,login } from "../controller/AuthController.js";
import authRateLimiter from "../../middleware/authratelimiter.js";

const router=Router()

router.post("/register",authRateLimiter,register)
router.post("/login", authRateLimiter, login)

export default router