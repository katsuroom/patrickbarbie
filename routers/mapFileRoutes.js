const express = require('express');
const router = express.Router();
const cors = require('cors'); 
const MapFileController = require('../controller/MapFileController');
const AuthController = require("../controller/authController");



router.use(cors());


router.get('/mapFile', MapFileController.sendMapFile);
router.get("/123", AuthController.getLoggedIn);

module.exports = router