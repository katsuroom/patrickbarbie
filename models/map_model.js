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
    username: { type: String, required: true },
    views: { type: Number, required: false },
    likes: { type: Number, required: false },
    likedUsers: { type: Array, required: false },
    isPublished: { type: Boolean, required: false },
    mapData: { type: String, required: false },
    csvField: { type: CSV_Schema, required: false },
    // comments section ...
  },
  { timestamps: true }
);


module.exports = mongoose.model('Map', MapSchema);