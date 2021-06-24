const path = require('path')
const bootstrapPath = path.join(__dirname, '../node_modules/bootstrap/dist')
const popperPath = path.join(__dirname, '../node_modules/@popperjs/core/dist/umd')
const publicDir = path.join(__dirname, '../public')

const bootstrapJsPath = path.join(bootstrapPath, 'js')
const bootstrapCssPath = path.join(bootstrapPath, 'css')
const bootstrapFontPath = path.join(bootstrapPath, 'fonts')

exports.paths = [
    {
        path: bootstrapJsPath,
        target: '/js/bootstrap'
    },
    {
        path: bootstrapCssPath,
        target: '/css/bootstrap'
    },
    {
        path: bootstrapFontPath,
        target: '/fonts/bootstrap'
    },
    {
        path: popperPath,
        target: '/js/popper'
    },
    {
        path: publicDir,
        target: '/'
    },
]

