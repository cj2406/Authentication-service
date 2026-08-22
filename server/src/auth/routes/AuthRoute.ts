import { Router } from "express";
import { register,login,refresh } from "../controller/AuthController.js";
import authRateLimiter from "../../middleware/authratelimiter.js";
import { registerSchema,loginSchema } from "../validation/authSchema.js";
import { validate } from "../../middleware/validate.js";

const router=Router()

router.post("/register",authRateLimiter,validate(registerSchema),register)
router.post("/login", authRateLimiter,validate(loginSchema), login)
router.post("/refresh",authRateLimiter,refresh)


export default router
/*
Hi [First Name],
Although we haven’t met, your profile came up when I was looking for [Position Title] at [Company
Name]. I was very impressed with your background and would like to learn more about your career path
at [Company Name]. Please consider connecting with me.
Copyright ©2021 Global Mentorship Initiative, All Rights Reserved globalmentorship.org
Best regards,
[First Name Last Name]
Accounting student graduating June 2020
 */

/*
CODVEDA TASKS
Task 1: Basic Calculator

Create a class with methods for each arithmetic
operation.
Take input from the user for numbers and the desired
operation.
Handle edge cases like division by zero.
 */