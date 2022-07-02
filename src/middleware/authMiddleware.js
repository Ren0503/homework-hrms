const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const logger = require('../config/logging')
const { verifyToken } = require('../utils/token')

exports.protect = asyncHandler(async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = verifyToken(token)

            req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            logger.error(error)
            res.status(401)
            throw new Error(req.polyglot.t('401-token'))
        }
    }

    if (!token) {
        res.status(401)
        throw new Error(req.polyglot.t('401-notoken'))
    }
})

exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 9) {
        next()
    } else {
        res.status(403)
        throw new Error(req.polyglot.t('403'))
    }
}