const express = require('express')
const app = express()
require('dotenv').config()
const methodOverride = require('method-override')
const path = require('path')
const PORT = process.env.PORT
const ejsMate = require('ejs-mate')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/users')
const ExpressError = require('./untilities/ExpressError')


//database
const mongoose = require('mongoose')
const mongoURI = process.env.MONGODBURI

const db = mongoose.connection;

mongoose.connect(mongoURI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

db.on('error', console.error.bind(console, "connection error"))
db.once('open', () => {
    console.log("Database Connected")
})

//session config
const sessionConfig = {
    secret: "secretsecrethehe",
    resave: false,
    saveUninitialized: true,
    cooke: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

//ejs
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


//middlewares
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(session(sessionConfig))

//authentication
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



//controllers

//resource routes
const resourceController = require('./controllers/resource')
app.use('/resource', resourceController)

// Users routes
const usersController = require('./controllers/users')
app.use('/', usersController)

// home page
app.get('/', (req, res) => {
    res.render('home.ejs')
})


//error handling

app.get('/error', (req, res) => {
    chicken.fly()
})


app.use((err, req, res, next) => {
    const { status = 500, message } = err
    res.render('error.ejs', {
        error: status,
        message: message
    })
    next(err)
})

app.use((req, res) => {
    res.status(404).render('notfound.ejs')
})

app.listen(PORT, () => {
    console.log('Listening on ', PORT)
})
