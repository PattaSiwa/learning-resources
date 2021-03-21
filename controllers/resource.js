const e = require('express');
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
    Resource.find({}, (err, foundResources, next) => {
        if (err) { //null is the query was ok
            console.log(err)
            next(err)
        } else {
            const sortedResources = foundResources.sort((a, b) => {
                return (a.subject > b.subject) ? 1 : -1
            })
            console.log(sortedResources)
            res.render('index.ejs', {
                resource: sortedResources
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
            img: "/uploads/images/snakesladders.png"

        },
        {
            name: 'Match The Memory',
            url: 'https://matchthememory.com/',
            description: "Memory game where you match cards to help improve your memory",
            subject: "Games",
            img: "/uploads/images/memory.png"

        },
        {
            name: 'Battleship',
            url: 'http://en.battleship-game.org/id22892859/classic',
            description: "A web game based on the classic game Battleship. Let users play with each other across the web!",
            subject: "Games",
            img: "/uploads/images/battleship.png"

        },
    ], (err, data) => {
        if (err) {
            console.log(err)
        }
        res.redirect('/resource')
    })
})

// new route
router.get('/new', (req, res) => {
    res.render('new.ejs')
})

// post route "create"

router.post('/', (req, res) => {
    const newResource = req.body

    if (newResource.img === '') {
        newResource.img = "https://images.unsplash.com/photo-1612385763901-68857dd4c43c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80"
    }

    Resource.create(newResource, (err, createdResource) => {
        if (err) {
            res.send(err)
        } else {
            res.redirect('/resource')
        }
    })
})

// Delete route
router.delete('/:index', (req, res) => {
    Resource.findByIdAndRemove(req.params.index, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            // redirect to the index so the user can see that the fruit got deleted
            // console.log(data)
            res.redirect('/resource')
        }
    })
})

// EDIT route
router.get('/:index/edit', (req, res) => {
    Resource.findById(req.params.index, (err, foundResource) => {
        res.render('edit.ejs', {
            resource: foundResource,
            // currentUser: req.session.currentUser
        })

    })
})

//UPDATE route 
router.put('/:index', (req, res) => {
    Resource.findByIdAndUpdate(req.params.index, req.body, { new: true }, (err, updatedResource) => {
        res.redirect('/resource')
    })
})


//show route
router.get('/:index', (req, res) => {
    Resource.findById(req.params.index, (err, foundResource) => {
        res.render('show.ejs', { resource: foundResource })
    })
})

module.exports = router;