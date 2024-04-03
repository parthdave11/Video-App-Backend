// CORS => Cross Origin Resource Sharing.
// When we use middle ware then most of time we use it using app.use().

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser' // we can access the cookies of user through our server.

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes

import userRouter from '../src/routes/user.routes.js'

// routes declaration

app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register

export { app }