const {EXPRESS_SESSION_SECRET, PORT, HOST} = require('./env')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const {getUser} = require('../utils/middleware')
const User = require('../models/user')
const path = require('path')
const bootstrapPath = path.join(__dirname, '../node_modules/bootstrap3/dist')
const commentRoutes = require('../routes/comments')
const campgroundRoutes = require('../routes/campgrounds')
const indexRoutes = require('../routes/index')

const app = express()
app.set('view engine', 'ejs')
app.use('/css', express.static(path.join(bootstrapPath, 'css')))
app.use('/js', express.static(path.join(bootstrapPath, 'js')))
app.use('/fonts', express.static(path.join(bootstrapPath, 'fonts')))
app.use(express.static(`../public`))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(session({
    secret: EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(getUser)

app.use('/campgrounds/:id/comments', commentRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use(indexRoutes)

app.listen(PORT, HOST, () => {
    console.log(`listening on ${HOST}:${PORT}`)
})

exports.app = app
