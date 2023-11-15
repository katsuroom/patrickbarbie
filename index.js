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
app.use(cors(
    {
    origin: ["http://localhost:3000"],
    credentials: true,
    optionSuccessStatus:200
}
))
app.use(CorsObject(CorsOptions));
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routers/authRoutes')
app.use('/auth', authRouter)

const connectDB = require('./connectDB')

connectDB();

if(process.env.NODE_ENV === "production")
{
    app.use(express.static(path.join(__dirname, "/client/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})