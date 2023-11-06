const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const path = require('path');

dotenv.config()
const PORT = process.env.PORT;
const app = express()

const mongoose = require('mongoose')

//
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routers/authRoutes')
app.use('/auth', authRouter)

const connectDB = require('./connectDB')

connectDB()

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})