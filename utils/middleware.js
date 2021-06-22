const Campground = require('../models/campground')

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
