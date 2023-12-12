const express = require('express');
const MapController = require('../controller/storeController');
const router = express.Router();
const auth = require('../auth');

router.post('/map', auth, MapController.createMap);
router.post('/forkmap', auth, MapController.forkMap);
router.delete('/map/:id', auth, MapController.deleteMap);

router.put('/map/:id',auth, MapController.updateMap);
router.get('/maps', auth, MapController.getMapsByUser);
router.get('/map/:id', MapController.getMapById);
router.get('/published-maps', MapController.getPublishedMaps);
router.get('/search-maps/:searchText/:searchBy', MapController.searchMaps);


router.get('/mapData/:id', MapController.getMapDataById);
router.delete('/mapData/:id', MapController.deleteMapData);
router.put('/mapData/:id', auth, MapController.updateMapData);

router.get('/mapFile', MapController.sendMapFile);
router.post('/csv', MapController.createCSV);
router.get('/csv/:id', MapController.getCSVById);
router.put('/csv/:id', MapController.updateCSV);
router.delete('/csv/:id', MapController.deleteCSV);





module.exports = router