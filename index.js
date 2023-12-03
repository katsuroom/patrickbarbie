const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const path = require('path');
// const expressJwt = require("express-jwt");
const app = express()
dotenv.config()
const PORT = process.env.PORT;

app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({limit: '1000mb', extended: true, parameterLimit: 50000}));


app.use(express.urlencoded({ extended: true }))
app.use(cors(
    {
    origin: ["http://localhost:3000"],
    credentials: true,
    optionSuccessStatus:200
}
))
app.use(express.json());
app.use(cookieParser());


// app.use(
//   expressJwt({ secret: process.env.JWT_SECRET }).unless({
//     path: [/^\/login/, /^\/auth/, /^\/published-maps/, /^\/mapFile/],
//   })
// );
// app.use((err, req, res, next) => {
//   if (err.name === "UnauthorizedError") {
//     res.status(401).send({ message: "token Unauthorized" });
//   }else{
//     console.log("pass authorization");
//   }
// });


const authRouter = require('./routers/authRoutes')
app.use('/auth', authRouter)
const mapRouter = require('./routers/mapRoute')
app.use("/api", mapRouter);



const connectDB = require('./connectDB')

connectDB();

if(process.env.NODE_ENV === "production")
{
    app.use(express.static(path.join(__dirname, "/client/out")));

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "out", "index.html"));
    });

    app.get("/login", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "out", "login.html"));
    });

    app.get("/register", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "out", "register.html"));
    });

    app.get("/recovery", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "out", "recovery.html"));
    });

    app.get("/main", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "out", "main.html"));
    });

    app.get("/password-recovery", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "out", "password-recovery.html"));
    });
}

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})