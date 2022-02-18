const path = require('path')

const home = (req, res) => {
    console.log(__dirname)
    return res.render('home')
}

module.exports = {
    'getHome' : home,
}