const Campground = require('../models/campground')
const Comment = require('../models/comment')

exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated())
        return res.redirect('/login')
    next()
}

exports.getUser = (req, res, next) => {
    res.locals.user = req.user
    next()
}

exports.assertAuthorization = async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id)
        if(!campground.author.id.equals(req.user._id))
            return res.redirect('back')
        res.locals.campground = campground
        next()
    } catch (e) {
        console.log(e)
        res.redirect('back')
    }
}

exports.assertCommentOwner = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if(!comment.author.id.equals(req.user._id))
            res.redirect('back')
        res.locals.comment = comment
        next()
    } catch (e) {
        console.log(e)
        res.redirect('back')
    }
}
