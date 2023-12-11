const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MapDataSchema = new Schema(
    {
        n: {type: Number, required: true},
        totalChunks: {type: Number, required: true},
        mapDataID: {type: String, required: true},
        data: {type: String, required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('MapData', MapDataSchema)