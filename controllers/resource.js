const express = require('express');
const { findById } = require('../models/resource');
const router = express.Router();
const Resource = require('../models/resource');
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync')
const { isLoggedIn, isAuthor, isAdmin } = require('../utilities/middleware')


const subjects = ["Math", "Games", "Science", "Language", "Job-Readiness", "Independent-Living", "Other"]



//index route 
router.get('/', catchAsync(async (req, res) => {
    const resources = await Resource.find({})
    const sortedResources = resources.sort((a, b) => {
        return (a.subject > b.subject) ? 1 : -1
    })
    res.render('resource/index.ejs', {
        resource: sortedResources
    })
}))


//seed route
// router.get('/seed', isAdmin, catchAsync(async (req, res) => {


//     Resource.create([
//         {
//             name: 'Snakes and Ladders',
//             url: 'https://www.turtlediary.com/game/snakes-and-ladders.html',
//             description: "Snakes and Ladders is an interactive online version of the classic board game.This game will improve the kid's counting skills, calculating skills and sharpen the mind.",
//             subject: "Math",
//             img: "/uploads/images/snakesladders.png",
//             author: '605a8af90318146af80d7c59'

//         },
//         {
//             name: 'Match The Memory',
//             url: 'https://matchthememory.com/',
//             description: "Memory game where you match cards to help improve your memory",
//             subject: "Games",
//             img: "/uploads/images/memory.png",
//             author: '605a8af90318146af80d7c59',

//         },
//         {
//             name: 'Battleship',
//             url: 'http://en.battleship-game.org/id22892859/classic',
//             description: "A web game based on the classic game Battleship. Let users play with each other across the web!",
//             subject: "Games",
//             img: "/uploads/images/battleship.png",
//             author: '605a8af90318146af80d7c59'

//         },
//         {
//             name: 'Drawasaurus',
//             url: 'https://www.drawasaurus.org/',
//             description: "Online Pictionary game. You can create your own private room to play with your friends or join a public room and make new friends while practicing your art skills!",
//             subject: "Games",
//             img: "https://i.ytimg.com/vi/k5un60wuCfM/maxresdefault.jpg",
//             author: '605a8af90318146af80d7c59'

//         },
//     ], (err, data) => {
//         if (err) {
//             console.log(err)
//         }
//         res.redirect('/resource')
//     })
// }))

// new route
router.get('/new', isLoggedIn, (req, res) => {

    res.render('resource/new.ejs', {
        subjects: subjects
    })
})

// post route "create"
router.post('/', isLoggedIn, catchAsync(async (req, res, next) => {

    const recievedResource = req.body
    if (recievedResource.img === '') {
        //if they dont put in image then put in image from unsplash
        recievedResource.img = 'https://images.unsplash.com/photo-1574492909706-09f2b2f0d909?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    }
    recievedResource.author = req.user.id;
    const newResource = new Resource(recievedResource)
    await newResource.save()
    req.flash('success', 'Resource Added! Thank you for your contribution!')
    res.redirect('/resource')

}))

// Delete route
router.delete('/:index', isAuthor, catchAsync(async (req, res) => {
    const index = req.params.index
    const resource = await Resource.findById(index)

    const deletedResource = await Resource.findByIdAndRemove(index)
    req.flash('success', `Resource Deleted!`)
    res.redirect('/resource')

}))

// EDIT route
router.get('/:index/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const index = req.params.index
    const resource = await Resource.findById(index)
    if (!resource) {
        req.flash('error', 'Resource not found')
        res.redirect('/resource')
    }
    res.render('resource/edit.ejs', {
        resource: resource,
        subjects: subjects

    })

}))

//UPDATE route 
router.put('/:index', isAuthor, catchAsync(async (req, res) => {
    const index = req.params.index
    const updateResource = await Resource.findByIdAndUpdate(index, req.body, { runValidators: true, new: true });
    req.flash('success', 'Resource Updated!')
    res.redirect(`/resource/${index}`)
}))


//show route
router.get('/:index', catchAsync(async (req, res, next) => {
    const index = req.params.index
    const resource = await Resource.findById(index).populate('author')
    if (!resource) {
        req.flash('error', 'Resource not found')
        res.redirect('/resource')
    }
    res.render('resource/show.ejs', { resource: resource })

}))

module.exports = router;