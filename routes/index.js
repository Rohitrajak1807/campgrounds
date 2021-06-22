const passport = require('passport')
const router = require('express').Router()
const {registerUser} = require('../utils/auth')

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    try {
        await registerUser(req, res)
        res.redirect('/campgrounds')
    } catch (e) {
        console.log(e)
        res.render('register')
    }
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
}))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/campgrounds')
})


router.get('/', (req, res) => {
    res.render('landing')
})

module.exports = router
