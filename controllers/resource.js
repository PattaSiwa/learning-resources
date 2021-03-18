const express = require('express');
const router = express.Router();
const Resource = require('../models/resource')
// const multer = require('multer')

// const storage = multer.diskStorage({

//     //destination for files
//     destination: function (request, file, callback) {
//         callback(null, './public/uploads/images')
//     },
//     //add back the extension
//     filename: function (request, file, callback) {
//         callback(null, Date.now() + file.originalname)
//     }
// })

// //upload parameters from multer
// const upload = multer({
//     storage: storage,
//     limits: {
//         fieldSize: 1024 * 1024 * 3,
//     },
// })

//index route 
router.get('/', (req, res) => {
    Resource.find({}, (err, foundResource, next) => {
        if (err) { //null is the query was ok
            console.log(err)
            next(err)
        } else {
            res.render('index.ejs', {
                resource: foundResource
            })
        }
    })
})

//seed route 
router.get('/seed', (req, res) => {


    Resource.create([
        {
            name: 'Snakes and Ladders',
            url: 'https://www.turtlediary.com/game/snakes-and-ladders.html',
            description: "Snakes and Ladders is an interactive online version of the classic board game.This game will improve the kid's counting skills, calculating skills and sharpen the mind.",
            subject: "Math",
            img: "uploads/images/snakesladders.png"

        },
        {
            name: 'Match The Memory',
            url: 'https://matchthememory.com/',
            description: "Memory game where you match cards to help improve your memory",
            subject: "Games",
            img: "uploads/images/memory.png"

        },
        {
            name: 'Battleship',
            url: 'http://en.battleship-game.org/id22892859/classic',
            description: "A web game based on the classic game Battleship. Let users play with each other across the web!",
            subject: "Games",
            img: "uploads/images/battleship.png"

        },
    ], (err, data) => {
        if (err) {
            console.log(err)
        }
        res.redirect('/resource')
    })
})

module.exports = router;