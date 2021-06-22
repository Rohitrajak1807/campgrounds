const router = require('express').Router({
    mergeParams: true
})
const Comment = require('../models/comment')
const Campground = require('../models/campground')
const {isLoggedIn} = require('../utils/middleware')

router.get('/new', isLoggedIn, async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id)
        res.render('comments/new', {
            campground: campground
        })
    } catch (e) {
        console.log(e)
        res.redirect(`/campgrounds/${req.params.id}`)
    }
})

router.post('/', isLoggedIn, async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id)
        const comment = await Comment.create(req.body.comment)
        campground.comments.push(comment)
        await campground.save()
        res.redirect(`/campgrounds/${req.params.id}`)
    } catch (e) {
        console.log(e)
        // well we'll work on an error page
        res.status(500).redirect('/campgrounds')
    }
})

module.exports = router
