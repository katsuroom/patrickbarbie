const express = require('express');
const router = express.Router();
const cors = require('cors'); 
const AuthController = require('../controller/authController');


router.use(cors());

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);

module.exports = router;
