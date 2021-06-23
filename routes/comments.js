const router = require('express').Router({
    mergeParams: true
})
const Comment = require('../models/comment')
const Campground = require('../models/campground')
const {redirectIfNotLoggedIn, assertCommentOwner, assertCampgroundExists} = require('../utils/middleware')

router.get('/:commentId/edit', redirectIfNotLoggedIn, assertCampgroundExists, assertCommentOwner, async (req, res) => {
    res.render('comments/edit', {
        campgroundId: req.params.id,
        comment: res.locals.comment
    })
})

router.delete('/:commentId', redirectIfNotLoggedIn, assertCampgroundExists, assertCommentOwner, async (req, res) => {
    try {
        await res.locals.comment.deleteOne()
        req.flash('success', 'Comment deleted')
        res.redirect(`/campgrounds/${req.params.id}`)
    } catch (e) {
        console.log(e)
        req.flash('error', 'Something went wrong')
        res.redirect('back')
    }
})

router.put('/:commentId', redirectIfNotLoggedIn, assertCampgroundExists, assertCommentOwner, async (req, res) => {
    try {
        await res.locals.comment.updateOne(req.body.comment)
        req.flash('success', 'Comment Updated')
        res.redirect(`/campgrounds/${req.params.id}`)
    } catch (e) {
        console.log(e)
        req.flash('error', 'Something went wrong')
        res.redirect('back')
    }
})

router.get('/new', redirectIfNotLoggedIn, assertCampgroundExists, async (req, res) => {
    res.render('comments/new', {
        campground: res.locals.campground
    })
})

router.post('/', redirectIfNotLoggedIn, assertCampgroundExists, async (req, res) => {
    try {
        const campground = res.locals.campground
        const {_id, username} = req.user
        const comment = await Comment.create({
            text: req.body.comment.text,
            author: {
                username: username,
                id: _id
            }
        })
        campground.comments.push(comment)
        await campground.save()
        req.flash('success', 'Comment added')
        res.redirect(`/campgrounds/${req.params.id}`)
    } catch (e) {
        console.log(e)
        req.flash('error', 'Something went wrong')
        res.redirect('back')
    }
})

module.exports = router
