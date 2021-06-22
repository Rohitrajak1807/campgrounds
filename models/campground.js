const mongoose = require('mongoose')
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
      id: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'User'
      },
        username: String
    },
    comments: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Comment'
        }
    ]
})

module.exports = mongoose.model('Campground', campgroundSchema)
