const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/users')
const catchAsync = require('../utilities/catchAsync')


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if (err) return next(err)
            req.flash('success', `You ceated an account! You are logged in as ${req.user.username}`)
            res.redirect('/resource')
        })

    } catch (e) {
        req.flash('error', `Invalid Information, Please try again`)
        res.redirect('/users/register')
    }


}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), (req, res) => {
    req.flash('success', `Welcome back ${req.user.username}!`)
    const redirectUrl = req.session.returnTo || '/resource'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "You've Logged Out!")
    res.redirect('/resource')
})

module.exports = router