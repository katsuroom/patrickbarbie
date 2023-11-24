const express = require('express')
const MapController = require('../controller/storeController')
const router = express.Router()
// const auth = require('../auth')

router.post('/map', MapController.createMap)
router.delete('/map/:id', MapController.deleteMap)

router.put('/map/:id', MapController.updateMap)
router.get('/maps', MapController.getMapsByUser)
router.get('/map/:id', MapController.getMapById)
router.get('/published-maps', MapController.getPublishedMaps)

module.exports = router