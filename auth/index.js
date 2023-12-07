const jwt = require("jsonwebtoken")

const dotenv = require("dotenv");

dotenv.config();
const SECRET = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  try {
    console.log("auth");
    // console.log("req");
    const token = req.headers.authorization.split(" ")[1];
    if(!token) return;

    const isCustomAuth = token.length < 500;

    let decodeData;

    //If token is custom token do this
    if (isCustomAuth) {
      decodeData = jwt.verify(token, SECRET);

      req.userId = decodeData?.userId;
      console.log("verify, req.userId: " + req.userId);
    } else {
      //Else of token is google token then do this
      decodeData = jwt.decode(token);

      req.userId = decodeData?.userId;
      console.log("decode, req.userId: " + req.userId);
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth; 