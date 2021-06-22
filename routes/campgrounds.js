const express = require('express')
const router = express.Router()
require('../models/comment')
const Campground = require('../models/campground')
const {isLoggedIn, assertAuthorization} = require('../utils/middleware')

router.get('/', async (req, res) => {
    try {
        const campgrounds = await Campground.find({})
        res.render('campgrounds/index', {
            campgrounds: campgrounds
        })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }

})

router.post('/', isLoggedIn, async (req, res) => {
    try {
        const {name, image, description} = req.body
        const {username, _id} = req.user
        const newCampground = await Campground.create({
            name: name,
            image: image,
            description: description,
            author: {
                id: _id,
                username: username
            }
        })
        console.log(newCampground._id)
        res.redirect('/campgrounds')
    } catch (e) {
        console.log(e)
    }
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id', async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id).populate('comments')
        console.log(campground)
        res.render('campgrounds/show', {
            campground: campground
        })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

router.get('/:id/edit', isLoggedIn, assertAuthorization, async (req, res) => {
        res.render('campgrounds/edit', {
            campground: res.locals.campground
        })
})

router.put('/:id', isLoggedIn, assertAuthorization,async (req, res) => {
    try {
        const campground = await res.locals.campground.updateOne(req.body.campground)
        console.log(campground)
        res.redirect(`/campgrounds/${req.params.id}`)
    } catch (e) {
        console.log(e)
        res.redirect('/campgrounds')
    }
})

router.delete('/:id', isLoggedIn, assertAuthorization,async (req, res) => {
    try {
        await res.locals.campground.deleteOne()
    } catch (e) {
        console.log(e)

    } finally {
        res.redirect('/campgrounds')
    }
})

module.exports = router
