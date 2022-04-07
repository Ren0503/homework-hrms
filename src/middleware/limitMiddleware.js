const asyncHandler = require("express-async-handler");
const cache = require('../config/cache')

exports.blocking = asyncHandler(async (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    console.log(ip)

    const data = await cache.get(ip)

    if (data && data > 4) {
        res.set('Retry-After', String(60));
        res.status(429).json('Too Many Requests');
    } else {
        next()
    }
})