const express = require('express');
const router = express.Router();
const Resource = require('../models/resource')

//index route 
router.get('/', (req, res) => {
    res.render('index.ejs')
})


module.exports = router;