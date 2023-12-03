const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Replies = new Schema(
  {
    id: { type: Number, required: true },
    author: { type: String, required: true },
    timestamp: { type: Date, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const Comments = new Schema(
  {
    id: { type: Number, required: true },
    author: { type: String, required: true },
    timestamp: { type: Date, required: true },
    text: { type: String, required: true },
    replies: [{type: Replies}],
  },
  { _id: false }
);


// TODO: (done) Changed required to true
// TODO: after handle the mapDate buffer in the front end, change required to true
const MapSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    views: { type: Number, required: true, default: 0 },
    likes: { type: Number, required: true, default: 0 },
    likedUsers: { type: Array, required: false },
    isPublished: { type: Boolean, required: true, default: false },
    mapData: { type: Buffer, required: true },
    csvData: { type: String, required: false },
    comments: [{type: Comments}],
    mapType: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Map', MapSchema);