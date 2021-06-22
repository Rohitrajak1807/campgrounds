const mongoose = require('mongoose')
const {DB_URI} = require('./env')

module.exports = () => {
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    }).then(() => console.log(`connected to DB on ${DB_URI}`))
        .catch(err => {
            console.log(err)
            process.exit(1)
        })
}
