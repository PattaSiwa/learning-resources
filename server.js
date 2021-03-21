const express = require('express')
const app = express()
require('dotenv').config()
const methodOverride = require('method-override')
const PORT = process.env.PORT


//database
const mongoose = require('mongoose')
const mongoURI = process.env.MONGODBURI

const db = mongoose.connection;

mongoose.connect(mongoURI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("database connection checked");
})

db.on('error', (err) => { console.log('ERROR: ', err) });
db.on('connected', () => { console.log("mongo connected") })
db.on('disconnected', () => { console.log("mongo disconnected") })


//middlewares
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

//controllers

//resource routes
const resourceController = require('./controllers/resource')
app.use('/resource', resourceController)

// home page
app.get('/', (req, res) => {
    res.render('home.ejs')
})


app.listen(PORT, () => {
    console.log('Listening on ', PORT)
})
