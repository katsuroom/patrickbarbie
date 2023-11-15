const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CSV_Schema = new Schema(
    {
        csvUploaded: { type: binData, required: false },
        csvEntered: { type: binData, required: false }
    },
    { timestamps: true },
)


// TODO: Changed required to true
const MapSchema = new Schema(
    {
        title: { type: String, required: false },
        author: { type: String, required: false },
        views: { type: Integer, required: false },
        likes: { type: Integer, required: false },
        likedUsers: { type: Array, required: false },
        isPublished: { type: Boolean, required: false },
        mapData: {type: binData, required: false},
        csvField: {type: CSV_Schema, required: false}
        // comments section ...
    },
    { timestamps: true },
)


module.exports = mongoose.model('User', MapSchema);