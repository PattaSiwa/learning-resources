const mongoose = require('mongoose')
const { Schema, model } = mongoose


const resourceSchema = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    subject: { type: String },
    img: { type: String, required: true },
})

const Resource = model('Resource', resourceSchema)

module.exports = Resource