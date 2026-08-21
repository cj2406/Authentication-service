import "dotenv/config"
import express from "express"
import prisma from "./db/prisma.js"
import cors from "cors"
import cookieParser from "cookie-parser"

import authRoute from "./auth/routes/AuthRoute.js"
import userRoutes from "./user/routes/user.route.js"

const app = express()
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173",credentials: true }))
app.use(express.json())
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoute)

app.get("/api/test-db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`

    res.json({
      message: "Database connection works!"
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Database connection failed"
    })
  }
})


app.get("/api/test", async (req, res) => {
  res.json({
      message: "Api is currently active!"
    })
})

app.listen(5000, () => {
  console.log("API running on http://localhost:5000")
})