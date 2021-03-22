const express = require('express')
const router = express.Router()
const User = require('../models/users')


router.get('/register', (req, res) => {
    res.render('users/register.ejs')
})

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body
    res.send(req.body)
})

module.exports = router