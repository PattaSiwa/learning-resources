const mongoose = require('mongoose')
const { Schema, model } = mongoose


const resourceSchema = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    subject: { type: String, required: true },
    img: { type: String, default: "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
})

const Resource = model('Resource', resourceSchema)

module.exports = Resource