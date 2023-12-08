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
    likedUsers: { type: Array, required: true, default: [] },
    isPublished: { type: Boolean, required: true, default: false },
    mapData: { type: String, required: true },
    csvData: { type: String, required: false },
    comments: [{type: Comments}],
    mapType: { type: String, required: true },
    mapProps: {type: Object, required: false}
  },
  { timestamps: true }
);

module.exports = mongoose.model('Map', MapSchema);