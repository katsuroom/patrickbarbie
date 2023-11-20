const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema(
    {
        username: { type: String, required: true, unique: true},
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        maps: [{ type: ObjectId, ref: 'Map' }],
    },
    { timestamps: true },
)

module.exports = mongoose.model('User', UserSchema)