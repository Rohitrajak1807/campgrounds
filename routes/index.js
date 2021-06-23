const passport = require('passport')
const router = require('express').Router()
const {registerUser} = require('../utils/auth')
const {redirectIfLoggedIn, redirectIfNotLoggedIn} = require('../utils/middleware')

router.get('/register', (req, res) => {
    res.render('register', {
        page: 'register'
    })
})

router.post('/register', async (req, res) => {
    try {
        await registerUser(req, res)
        res.redirect('/campgrounds')
    } catch (e) {
        console.log(e)
        req.flash('error', e.message)
        res.redirect('back')
    }
})

router.get('/login', redirectIfLoggedIn, (req, res) => {
    res.render('login', {
        page: 'login'
    })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
}))

router.get('/logout', redirectIfNotLoggedIn, (req, res) => {
    req.logout()
    req.flash('success', 'Logged you out')
    res.redirect('/campgrounds')
})


router.get('/', (req, res) => {
    res.render('landing')
})

module.exports = router
