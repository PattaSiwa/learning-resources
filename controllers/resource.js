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
        resource: sortedResources,
        subjects: subjects,
    })
}))

// creating a page for each subject by looping and making each route 
for (let sub of subjects) {
    router.get(`/${sub}`, catchAsync(async (req, res) => {
        const resources = await Resource.find({ subject: sub })
        res.render('resource/index.ejs', {
            resource: resources,
            subjects: subjects,
        })
    }))
}




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