const Campground = require('../models/campground')
const Comment = require('../models/comment')

exports.redirectIfNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please Login first')
        return res.redirect('back')
    }
    next()
}

exports.redirectIfLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.flash('error', 'Already Logged In')
        return res.redirect('back')
    }
    next()
}

exports.getUser = (req, res, next) => {
    res.locals.user = req.user
    next()
}

exports.getFlashMessage = (req, res, next) => {
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next()
}

exports.assertCampgroundOwner = async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id)
        if (!campground.author.id.equals(req.user._id)) {
            req.flash('error', 'You don\'t have permission to do that')
            return res.redirect('back')
        }
        res.locals.campground = campground
        next()
    } catch (e) {
        console.log(e)
        req.flash('error', 'Cannot find campground')
        res.redirect('back')
    }
}

exports.assertCommentOwner = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if(!comment) {
            req.flash('error', 'Comment not found')
            return res.redirect('back')
        }
        if (!comment.author.id.equals(req.user._id)) {
            req.flash('error', 'You don\'t have permission to do that')
            return res.redirect('back')
        }
        res.locals.comment = comment
        next()
    } catch (e) {
        console.log(e)
        req.flash('error', 'Comment not found')
        res.redirect('back')
    }
}

exports.assertCampgroundExists = async (req, res, next) => {
    try {
        const campgroundId = req.params.id
        const campground = await Campground.findById(campgroundId)
        if(!campground) {
            req.flash('error', 'Campground not found')
            return res.redirect('back')
        }
        res.locals.campground = campground
        next()
    } catch (e) {
        console.log(e)
        req.flash('error', 'Campground not found')
        res.redirect('back')
    }
}
