const Map = require('../models/map_model');

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


module.exports = {
    createMap
}
