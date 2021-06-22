const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        username: String
    }
})

module.exports = mongoose.model('Comment', commentSchema)
