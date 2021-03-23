const express = require('express')
const router = express.Router()
const User = require('../models/users')


router.get('/register', (req, res) => {
    res.render('users/register.ejs')
})

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/resource')
    }


})

module.exports = router