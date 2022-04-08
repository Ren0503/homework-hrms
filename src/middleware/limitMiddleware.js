const asyncHandler = require("express-async-handler")
const cache = require('../config/cache')

exports.blockIP = asyncHandler(async (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 

    const data = await cache.get(ip)
    console.log(data)

    if (data && data > 4) {
        res.set('Retry-After', String(60))
        res.status(429)
        throw new Error('Too Many Requests')
    } else {
        next()
    }
})