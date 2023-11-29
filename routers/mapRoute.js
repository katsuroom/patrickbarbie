const express = require('express')
const MapController = require('../controller/storeController')
const router = express.Router()
const auth = require('../auth')

router.post('/map', auth, MapController.createMap)
router.post('/forkmap', auth, MapController.forkMap);
router.delete('/map/:id', auth, MapController.deleteMap)

router.put('/map/:id',auth, MapController.updateMap)
router.get('/maps', auth, MapController.getMapsByUser)
router.get('/map/:id', MapController.getMapById)
router.get('/published-maps', MapController.getPublishedMaps)


router.get('/mapFile', MapController.sendMapFile);
router.post('/csv', MapController.createCSV);
router.get('/csv/:id', MapController.getCSVById);
router.put('/csv/:id', MapController.updateCSV);





module.exports = router