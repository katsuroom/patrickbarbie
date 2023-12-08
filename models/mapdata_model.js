const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MapDataSchema = new Schema(
    {
        mapData: {type: Buffer, required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('MapData', MapDataSchema)