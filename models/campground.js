const mongoose = require('mongoose')
const Comment = require('./comment')

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

campgroundSchema.pre('deleteOne', {query: true}, async function () {
    try {
        const id = this.getQuery()._id
        const doc = await this.model.findById(id, {
            comments: 1
        })
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    } catch (e) {
        return console.log(e)
    }

})

module.exports = mongoose.model('Campground', campgroundSchema)
