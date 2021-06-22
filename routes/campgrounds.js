const express = require('express')
const router = express.Router()
require('../models/comment')
const Campground = require('../models/campground')

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

router.post('/', async (req, res) => {
    try {
        const {name, image, description} = req.body
        const newCampground = await Campground.create({
            name: name,
            image: image,
            description: description
        })
        console.log(newCampground._id)
        res.redirect('/campgrounds')
    } catch (e) {
        console.log(e)
    }
})

router.get('/new', (req, res) => {
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

module.exports = router
