const express = require('express')
const app = express()
require('dotenv').config()
const methodOverride = require('method-override')
const path = require('path')
const PORT = process.env.PORT
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/users')
const ExpressError = require('./utilities/ExpressError')


//database
const mongoose = require('mongoose')
const mongoURI = process.env.MONGODBURI

console.log(mongoURI)

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

session config
const sessionConfig = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}

app.get('/testing', (req, res) => {
    send('hello this is testing')
})

//ejs

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


//middlewares
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(session(sessionConfig))
app.use(flash())


//authentication
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// flash

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

//controllers

//resource routes
const resourceController = require('./controllers/resource')
app.use('/resource', resourceController)

// Users routes
const usersController = require('./controllers/users')
const { send } = require('process')
app.use('/users', usersController)

// home page
app.get('/', (req, res) => {
    res.render('home.ejs')
})


//error handling

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.get('/error', (req, res) => {
    chicken.fly()
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Somethign went wrong"
    }
    res.status(statusCode).render('error', { err })

})



app.listen(PORT, () => {
    console.log('Listening on ', PORT)
})
