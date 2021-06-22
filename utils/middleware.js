exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated())
        return res.redirect('/login')
    next()
}

exports.getUser = (req, res, next) => {
    res.locals.user = req.user
    next()
}
