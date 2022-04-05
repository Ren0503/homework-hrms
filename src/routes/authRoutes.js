const express = require('express')
const passport = require('passport')
const generateToken = require('../utils/generateToken')
const router = express.Router()

/* NOTE: 100% automatic */
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

/* NOTE: 100% automatic */
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        const token = generateToken(req.user._id)
        return res.cookie('token', token).send({ token });
    }
)

module.exports = router
