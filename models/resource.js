const mongoose = require('mongoose')
const { schema } = require('./users')
const { Schema, model } = mongoose


const resourceSchema = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    subject: { type: String, required: true },
    img: { type: String, },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Resource = model('Resource', resourceSchema)

module.exports = Resource