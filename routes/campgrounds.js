const express = require('express')
const router = express.Router()
require('../models/comment')
const Campground = require('../models/campground')
const {redirectIfNotLoggedIn, assertCampgroundOwner} = require('../utils/middleware')

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

router.post('/', redirectIfNotLoggedIn, async (req, res) => {
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
        req.flash('success', 'Campground added')
        res.redirect('/campgrounds')
    } catch (e) {
        console.log(e)
        req.flash('error', 'Unable to create campground')
        res.redirect('back')
    }
})

router.get('/new', redirectIfNotLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id', async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id).populate('comments')
        if(!campground) {
            req.flash('error', 'Capground doesn\'t exist')
            res.redirect('back')
        }
        res.render('campgrounds/show', {
            campground: campground
        })
    } catch (e) {
        console.log(e)
        res.redirect('/campgrounds')
    }
})

router.get('/:id/edit', redirectIfNotLoggedIn, assertCampgroundOwner, async (req, res) => {
        res.render('campgrounds/edit', {
            campground: res.locals.campground
        })
})

router.put('/:id', redirectIfNotLoggedIn, assertCampgroundOwner,async (req, res) => {
    try {
        const campground = await res.locals.campground.updateOne(req.body.campground)
        console.log(campground)
        req.flash('success', 'Campground Updated')
        res.redirect(`/campgrounds/${req.params.id}`)
    } catch (e) {
        console.log(e)
        req.flash('error', 'Unable to update')
        res.redirect('back')
    }
})

router.delete('/:id', redirectIfNotLoggedIn, assertCampgroundOwner,async (req, res) => {
    try {
        await res.locals.campground.deleteOne()
        req.flash('success', 'Campground deleted')
    } catch (e) {
        console.log(e)
    } finally {
        req.flash('error', 'Unable to delete')
        res.redirect('/campgrounds')
    }
})

module.exports = router
