const jwt = require("jsonwebtoken")

function authManager() {
    verify = (req, res, next) => {
        console.log("req: " + req);
        console.log("next: " + next);
        console.log("Who called verify?");
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "Unauthorized"
                })
            }

            const verified = jwt.verify(token, process.env.JWT_SECRET)
            console.log("verified.userId: " + verified.userId);
            req.userId = verified.userId;

            next();
        } catch (err) {
            console.error(err);
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Unauthorized"
            });
        }
    }

    verifyUser = (req) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return null;
            }

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            return decodedToken.userId;
        } catch (err) {
            return null;
        }
    }

    signToken = (userId) => {
        return jwt.sign({
            userId: userId
        }, process.env.JWT_SECRET);
    }

    return this;
}

const auth = authManager();
module.exports = auth;


// const jwtSecret = "asdasdasd";
// const express = require("express");
// const app = express();
// const expressJwt = require("express-jwt");

// app.use(
//   expressJwt({ secret: jwtSecret }).unless({
//     path: [/^\/map/, /^\/published-maps/],
//   })
// );
// app.use((err, req, res, next) => {
//   if (err.name === "UnauthorizedError") {
//     res.status(401).send({ message: "token Unauthorized" });
//   }
// });


// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();
// const SECRET = process.env.JWT_SECRET;

// const auth = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const isCustomAuth = token.length < 500;

//     let decodeData;

//     //If token is custom token do this
//     if (token && isCustomAuth) {
//       decodeData = jwt.verify(token, SECRET);

//       req.userId = decodeData?.userId;
//       console.log("verify, req.userId: " + userId);
//     } else {
//       //Else of token is google token then do this
//       decodeData = jwt.decode(token);

//       req.userId = decodeData?.userId;
//       console.log("decode, req.userId: " + userId);
//     }

//     next();
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default auth;