const Polyglot = require('node-polyglot')
const { messages } = require('../translate')

/* 
* Sets the phrases to be used for every req and res
* Receives the regular express req, res, next
* Sets req.plyglot with the phrases for the current locale
* Returns nothing, it calls next() to continue forward
*/
exports.startPolyglot = (req, res, next) => {
    // Get the locale from express-locale
    let locale
    if (req.headers["accept-language"]) {
        locale = req.headers["accept-language"].substring(0,2)
    } else {
        locale = 'en'
    }

    // Start Polyglot and add it to the req
    req.polyglot = new Polyglot()

    // Decide which phrases for polyglot
    if (locale == 'vi') {
        req.polyglot.extend(messages.vi)
    } else {
        req.polyglot.extend(messages.en)
    }

    next()
}