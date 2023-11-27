const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CSV_Schema = new Schema(
    {
        csvUploaded: { type: Buffer, required: false },
        csvEntered: { type: Buffer, required: false }
    },
    { timestamps: true },
)


// TODO: (done) Changed required to true
// TODO: after handle the mapDate buffer in the front end, change required to true
const MapSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    views: { type: Number, required: false },
    likes: { type: Number, required: false },
    likedUsers: { type: Array, required: false },
    isPublished: { type: Boolean, required: true, default: false },
    mapData: { type: Buffer, required: true },
    csvField: { type: CSV_Schema, required: false },
    comments: { type: Array, required: false },
    mapType: { type: String, required: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Map', MapSchema);