const asyncHandler = require('express-async-handler')

const Document = require('../models/documentModel')
const Confirm = require('../models/confirmModel')
const User = require('../models/userModel')

const cache = require('../config/cache')
const generateToken = require('../utils/generateToken')

// @desc    Login for admin
// @route   POST /api/admin/login
// @access  Public
exports.loginForAdmin = asyncHandler(async (req, res) => {
    const { name, password } = req.body
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    const data = await cache.get(ip)
    const user = await User.findOne({ name })

    if (user && (await user.matchPassword(password))) {
        if (user.role !== 9) {
            await cache.save(ip, 60, data + 1)

            res.status(401)
            throw new Error('Not authorized as an admin')
        }
        else {
            res.json({
                _id: user._id,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
                token: generateToken(user._id),
            })
        }
    } else {
        await cache.save(ip, 60, data + 1)

        res.status(401)
        throw new Error('Invalid name or password')
    }
})

// @desc    Get list of user
// @route   GET /api/admin/documents/:id/users
// @access  Private/Admin
exports.getListUsersForDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)
    const userConfirms = []
    let query = { role: { $ne: 9 } };

    if (document) {
        const confirms = await Confirm.find({ docId: req.params.id })

        if (confirms) {
            confirms.map((c) => (userConfirms.push(c.userId)))

            query._id = { $nin: userConfirms }
        }

        const users = await User.find(query)

        res.json(users)
    } else {
        res.status(404)
        throw new Error('Document not found')
    }
})

// @desc    Assign for user
// @route   POST /api/admin/documents/:id/assign
// @access  Private/Admin
exports.assignUserForDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)

    if (document) {
        let confirms = []
        
        // Get list users from body
        const [...userAssign] = req.body.userIds

        // Check user have assigned
        const userExits = []
        const confirmsExit = await Confirm.find({ docId: req.params.id })

        if (confirmsExit) {
            confirmsExit.map((c) => (userExits.push(c.userId.toString())))

            if (JSON.stringify(userAssign) == JSON.stringify(userExits)) {
                res.status(402)
                throw new Error('All users you send are assigned')
            }
        }

        // Create list confirms
        userAssign.forEach((element) => {
            if (!userExits.includes(element)) {
                confirms.push(
                    {
                        "userId": element,
                        "docId": req.params.id
                    }
                )
            }
        })

        const createdConfirms = await Confirm.insertMany(confirms);

        res.json(createdConfirms);
    } else {
        res.status(404)
        throw new Error('Document not found')
    }
})