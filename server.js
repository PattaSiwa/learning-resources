const express = require('express')
const app = express()
require('dotenv').config()
const methodOverride = require('method-override')
const PORT = process.env.PORT
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/users')


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

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'bxx@gmail.com', username: "bxx" })
    const newUser = await User.register(user, "monkey")
    res.send(newUser)
})

// home page
app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.use((req, res) => {
    res.status(404).render('notfound.ejs')
})

app.listen(PORT, () => {
    console.log('Listening on ', PORT)
})
