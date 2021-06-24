// referenced from
// https://stackoverflow.com/questions/38421664/fuzzy-searching-with-mongodb
exports.escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}
