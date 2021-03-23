const express = require('express');
const { findById } = require('../models/resource');
const router = express.Router();
const Resource = require('../models/resource')



const subjects = ["Math", "Games", "Science", "Language", "Job-Readiness", "Independent-Living", "Other"]
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
router.get('/', async (req, res) => {
    const resources = await Resource.find({})
    const sortedResources = resources.sort((a, b) => {
        return (a.subject > b.subject) ? 1 : -1
    })
    res.render('resource/index.ejs', {
        resource: sortedResources
    })
})


//seed route 
// router.get('/seed', (req, res) => {


//     Resource.create([
//         {
//             name: 'Snakes and Ladders',
//             url: 'https://www.turtlediary.com/game/snakes-and-ladders.html',
//             description: "Snakes and Ladders is an interactive online version of the classic board game.This game will improve the kid's counting skills, calculating skills and sharpen the mind.",
//             subject: "Math",
//             img: "/uploads/images/snakesladders.png"

//         },
//         {
//             name: 'Match The Memory',
//             url: 'https://matchthememory.com/',
//             description: "Memory game where you match cards to help improve your memory",
//             subject: "Games",
//             img: "/uploads/images/memory.png"

//         },
//         {
//             name: 'Battleship',
//             url: 'http://en.battleship-game.org/id22892859/classic',
//             description: "A web game based on the classic game Battleship. Let users play with each other across the web!",
//             subject: "Games",
//             img: "/uploads/images/battleship.png"

//         },
//     ], (err, data) => {
//         if (err) {
//             console.log(err)
//         }
//         res.redirect('/resource')
//     })
// })

// new route
router.get('/new', (req, res) => {
    res.render('resource/new.ejs', {
        subjects: subjects
    })
})

// post route "create"

router.post('/', async (req, res) => {
    const recievedResource = req.body

    if (recievedResource.img === '') {
        //if they dont put in image then put in this randomizer image from unsplash
        recievedResource.img = 'https://source.unsplash.com/collection/4303775'
    }

    const newResource = new Resource(recievedResource)
    await newResource.save()

    res.redirect('/resource')

})

// Delete route
router.delete('/:index', async (req, res) => {
    const index = req.params.index
    const deletedResource = await Resource.findByIdAndRemove(index)
    res.redirect('/resource')

})

// EDIT route
router.get('/:index/edit', async (req, res) => {
    const index = req.params.index
    const resource = await Resource.findById(index)
    res.render('resource/edit.ejs', {
        resource: resource,
        subjects: subjects
        // currentUser: req.session.currentUser
    })

})

//UPDATE route 
router.put('/:index', async (req, res) => {
    const index = req.params.index
    const resource = await Resource.findByIdAndUpdate(index, req.body, { runValidators: true, new: true });
    res.redirect(`/resource/${index}`)
})


//show route
router.get('/:index', (req, res) => {
    Resource.findById(req.params.index, (err, foundResource) => {
        res.render('resource/show.ejs', { resource: foundResource })
    })
})

module.exports = router;