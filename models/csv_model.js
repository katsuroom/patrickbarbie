const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CsvSchema = new Schema(
    {
        label: {type: String, required: true},
        key: {type: String, required: true},
        csvData: {type: Object, required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('CSV', CsvSchema)