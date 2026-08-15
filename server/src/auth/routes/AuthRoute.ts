import { Router } from "express";
import { register } from "../controller/AuthController.js";
import authRateLimiter from "../../middleware/authratelimiter.js";

const router=Router()

router.post("/register",authRateLimiter,register)

export default router