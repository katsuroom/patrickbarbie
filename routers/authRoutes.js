const express = require("express");
const router = express.Router();
const AuthController = require("../controller/authController");
const auth = require("../auth");

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get("/logout", AuthController.logoutUser);
router.get("/loggedIn", auth, AuthController.getLoggedIn);



module.exports = router;
