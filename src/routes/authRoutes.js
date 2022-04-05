const express = require('express')
const passport = require('passport')
const generateToken = require('../utils/generateToken')
const router = express.Router()

// @desc    Auth with Google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc    Google auth callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            avatar: req.user.avatar,
            role: req.user.role,
            token: generateToken(req.user._id),
        })
    }
)

module.exports = router
