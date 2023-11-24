const Map = require('../models/map_model');
const path = require('path');
const fs = require('fs');

createMap = async (req, res) => {
    
    console.log(req.body);
    const map = new Map(req.body);

    await map.save()
        .then(() => {
            return res.status(201).json({
                map
            });
        })
        .catch(error => {
            return res.status(400).json({
                errorMessage: "Map not created!\n" + error
            });
        })
}



sendMapFile = async (req, res) => {
    const fileName = req.query.fileName;
    console.log(fileName); 

    // Check if the file exists
    const filePath = path.join(__dirname, "../main-screen-maps", fileName);
    
    console.log(filePath);
    if (fs.existsSync(filePath)) {
        // If the file exists, send it with a 200 status code
        res.status(200).sendFile(filePath);
    } else {
        // If the file does not exist, send a 404 status code
        res.status(404).send('File not found');
    }
}


module.exports = {
    createMap,
    sendMapFile
}
