const express = require('express')
const app = express()
const PORT = process.env.PORT
require('dotenv').config()
const methodOverride = require('method-override')

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


//set up middlewares
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))



app.listen(PORT, () => {
    console.log('Listening on ', PORT)
})