const express = require('express')
const MapController = require('../controller/storeController')
const router = express.Router()
const auth = require('../auth')
const MapFileController = require('../controller/MapFileController');
const AuthController = require("../controller/authController");

router.post('/map', auth.verify, MapController.createMap)
// router.delete('/map/:id', auth.verify, MapController.deleteMap)
// // router.get('/playlist/:id', auth.verify, PlaylistController.getPlaylistById)
// // router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
// // router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
// router.put('/map/:id', auth.verify, MapController.updateMap)
// router.get('/maps', auth.verify, MapController.getMapsByUser)
// router.get('/map/:id', MapController.getMapById)
// router.get('/published-maps', MapController.getPublishedMaps)


// router.get('/mapFile/:mapFile', MapFileController.sendMapFile);
router.get('/mapFile', MapFileController.sendMapFile);
// router.get('/mapFile/:mapFile', AuthController.getLoggedIn); 




module.exports = router