const asyncHandler = require('express-async-handler')
const Document = require('../models/documentModel')
const Confirm = require('../models/confirmModel')
const User = require('../models/userModel')
const generateToken = require('../utils/generateToken')

// @desc    Login for admin
// @route   POST /api/admin/login
// @access  Public
exports.loginForAdmin = asyncHandler(async (req, res) => {
    const { name, password } = req.body

    const user = await User.findOne({ name })

    if (user && (await user.matchPassword(password))) {
        if (user.role !== 9) {
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
        res.status(401)
        throw new Error('Invalid name or password')
    }
})

// For test
exports.registerUser = asyncHandler(async (req, res) => {
    const { name, password } = req.body

    const userExists = await User.findOne({ name })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
        name,
        password,
        role: 9,
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
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
        const confirms = await Confirm.find({ document: req.params.id })

        if (confirms) {
            confirms.map((c) => (userConfirms.push(c.user)))
            console.log(userConfirms)

            query = { _id: { $nin: userConfirms }, role: { $ne: 9 } }
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
        const [...users] = req.body.userIds

        users.forEach(function (ele) {
            ele.document = req.params.id
        })

        const confirms = await Confirm.insertMany(users);

        res.json(confirms);
    } else {
        res.status(404)
        throw new Error('Document not found')
    }
})