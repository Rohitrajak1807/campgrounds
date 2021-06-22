const User = require('../models/user')
const passport = require('passport')

exports.registerUser = async (req, res) => {
    const {username, password} = req.body
    const newUser = new User({
        username: username
    })
    return new Promise((resolve, reject) => {
        User.register(newUser, password, (err, user) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            console.log(`${user._id} registered`)
            passport.authenticate('local')(req, res, () => {
                resolve()
            })
        })
    })
}
