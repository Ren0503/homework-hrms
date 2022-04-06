const asyncHandler = require('express-async-handler')
const Confirm = require('../models/confirmModel')
const Document = require('../models/documentModel')
const User = require('../models/userModel')
const googleAuth = require('../utils/googleAuth')
const generateToken = require('../utils/generateToken')

// @desc    Login for user
// @route   POST /api/admin/login
// @access  Public
exports.loginForUser = asyncHandler(async (req, res) => {
    const tokenId = req.body.tokenId
    const profile = await googleAuth.getProfileInfo(tokenId)

    let user = await User.findOne({ socialId: profile.sub })

    if (!user) {
        const newUser = {
            socialId: profile.sub,
            name: profile.name,
            avatar: profile.picture,
        }

        user = await User.create(newUser)
    }

    res.json({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        token: generateToken(user._id),
    })
})

// @desc    Fetch all documents
// @route   GET /api/user/documents
// @access  Private
exports.getDocumentsByUser = asyncHandler(async (req, res) => {
    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1

    const docConfirms = []
    const query = {
        user: req.user._id
    }

    const count = await Confirm.countDocuments(query)

    const confirm = await Confirm.find(query)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .populate('document')

    confirm.map((c) => (docConfirms.push({
        "_id": c.document._id, 
        "status": c.status, 
        "title": c.document.title, 
        "url": c.document.url,
        "assigned": c.createdAt
    })))

    res.json({ documents: docConfirms, page, pages: Math.ceil(count / pageSize), count })
})

// @desc    Read documents
// @route   GET /api/user/documents/:id
// @access  Private
exports.readingDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)

    if (document) {
        const confirm = await Confirm.findOne({ $and: [{ document: document._id }, { user: req.user._id }] })

        if (confirm) {
            confirm.status = "Reading"
            await confirm.save()

            res.json(document)
        } else {
            res.status(401)
            throw new Error('Not authorized, need admin assigned')
        }
    } else {
        res.status(404)
        throw new Error('Not found doc')
    }
})

// @desc    Confirm documents
// @route   GET /api/user/documents/:id/confirm
// @access  Private
exports.confirmDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)

    if (document) {
        const confirm = await Confirm.findOne({ $and: [{ document: document._id }, { user: req.user._id }] })

        if (confirm) {
            confirm.status = "Completed"
            await confirm.save()

            res.status(200).json("Confirm success")
        } else {
            res.status(401)
            throw new Error('Not authorized, need admin assigned')
        }
    } else {
        res.status(404)
        throw new Error('Not found doc')
    }
})