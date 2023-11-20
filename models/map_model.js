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
        views: { type: Number, required: false },
        likes: { type: Number, required: false },
        likedUsers: { type: Array, required: false },
        isPublished: { type: Boolean, required: false },
        mapData: {type: Map, required: false},
        csvField: {type: CSV_Schema, required: false},
        comments: {type: Array, required: false}
    },
    { timestamps: true },
)


module.exports = mongoose.model('Map', MapSchema);