const express = require('express');
const router = express.Router();
const cors = require('cors'); 
const StoreController = require('../controller/storeController');


router.use(cors());

router.post('/map', StoreController.createMap);


module.exports = router;
