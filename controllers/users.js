const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/users')
const catchAsync = require('../utilities/catchAsync')
const { isAdmin } = require('../utilities/middleware')


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

//user index
router.get('/manage', isAdmin, async (req, res) => {
    const users = await User.find({})

    res.render('users/manage', {
        users
    })
})

//user edit
router.get('/:index/edit', isAdmin, catchAsync(async (req, res) => {
    const index = req.params.index
    const user = await User.findById(index)
    if (!user) {
        req.flash('error', 'User not found')
        res.redirect('/users/manage')
    }
    res.render('users/useredit', { user })
}))

//user update
router.put('/:index', isAdmin, catchAsync(async (req, res) => {
    const index = req.params.index
    const users = await User.find({})
    for (let user of users) {
        if (user.username === req.body.username) {
            req.flash('error', 'Cannot make account with that name')
            res.redirect('/users/manage')
        }
    }

    const updateUser = await User.findByIdAndUpdate(index, req.body, { runValidators: true, new: true });
    req.flash('success', 'User Updated')
    res.redirect('/users/manage')

}))

// user delete
router.delete('/:index', isAdmin, catchAsync(async (req, res) => {
    const index = req.params.index
    const deletedUser = await User.findByIdAndRemove(index)
    req.flash('success', `User Deleted`)
    res.redirect('/users/manage')

}))
module.exports = router