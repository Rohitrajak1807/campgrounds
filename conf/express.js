const {EXPRESS_SESSION_SECRET, PORT, HOST} = require('./env')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const {getUser, getFlashMessage} = require('../utils/middleware')
const User = require('../models/user')
const commentRoutes = require('../routes/comments')
const campgroundRoutes = require('../routes/campgrounds')
const indexRoutes = require('../routes/index')
const methodOverride = require('method-override')
const flash = require('connect-flash')

const path = require('path')
const bootstrapPath = path.join(__dirname, '../node_modules/bootstrap/dist')
const popperPath = path.join(__dirname, '../node_modules/@popperjs/core/dist/umd')
const publicDir = path.join(__dirname, '../public')

const app = express()
app.set('view engine', 'ejs')
app.use('/css/bootstrap', express.static(path.join(bootstrapPath, 'css')))
app.use('/js/bootstrap', express.static(path.join(bootstrapPath, 'js')))
app.use('/js/popper', express.static(popperPath))
app.use('/fonts/bootstrap', express.static(path.join(bootstrapPath, 'fonts')))

app.use(express.static(publicDir))
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(session({
    secret: EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(getUser)
app.use(getFlashMessage)

app.use('/campgrounds/:id/comments', commentRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use(indexRoutes)

app.listen(PORT, HOST, () => {
    console.log(`listening on ${HOST}:${PORT}`)
})

exports.app = app
