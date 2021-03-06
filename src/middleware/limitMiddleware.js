const asyncHandler = require("express-async-handler")
const cache = require('../config/cache')

exports.blockIP = asyncHandler(async (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 

    const data = await cache.get(ip)

    if (data && data > 4) {
        res.set('Retry-After', String(60))
        res.status(429)
        throw new Error(req.polyglot.t('429'))
    } else {
        next()
    }
})