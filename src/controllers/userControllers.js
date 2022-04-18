const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

const Confirm = require('../models/confirmModel')
const Document = require('../models/documentModel')
const User = require('../models/userModel')

const googleAuth = require('../utils/googleAuth')
const { generateToken } = require('../utils/generateToken')

// @desc    Login for user
// @route   POST /api/admin/login
// @access  Public
exports.loginForUser = asyncHandler(async (req, res) => {
    const result = validationResult(req)

    if (!result.isEmpty()) {
        const errors = result.array({ onlyFirstError: true })
        return res.status(422).json({ errors })
    }

    const tokenId = req.body.tokenId
    const profile = await googleAuth.getProfileInfo(tokenId)
    if (!profile)
        return res.status(404)

    let user = await User.findOne({ socialId: profile.sub })

    if (!user) {
        const newUser = {
            socialId: profile.sub,
            name: profile.name,
            avatar: profile.picture,
        }

        user = await User.create(newUser)
    }

    /*  #swagger.tags = ['User']
        #swagger.description = 'Endpoint to get the specific user.'
    */
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
    const pageSize = Number(req.query.perPage) || 12
    const page = Number(req.query.pageNumber) || 1

    const docConfirms = []
    const query = {
        userId: req.user._id,
        deleted: false
    }

    const count = await Confirm.countDocuments(query)

    const confirm = await Confirm.find(query)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .populate('docId')

    confirm.map((c) => (docConfirms.push({
        "_id": c.docId._id,
        "status": c.status,
        "title": c.docId.title,
        "url": c.docId.url,
        "assigned": c.createdAt
    })))

    /*  #swagger.tags = ['User']
        #swagger.description = 'Endpoint to get the specific user.' 
        #swagger.security = [{
            "Bearer": []
        }]
    */
    res.json({ documents: docConfirms, page, pages: Math.ceil(count / pageSize), count })
})

// @desc    Confirm documents
// @route   GET /api/user/documents/:id/confirm
// @access  Private
exports.confirmDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id)

    if (document) {
        const confirm = await Confirm.findOne({ $and: [{ docId: document._id }, { userId: req.user._id }] })

        if (confirm) {
            confirm.status = "C"
            await confirm.save()

            /*  #swagger.tags = ['User']
                #swagger.description = 'Endpoint to get the specific user.'
                #swagger.security = [{
                    "Bearer": []
                }]
            */
            res.status(200).json("Confirm success")
        } else {
            res.status(403)
            throw new Error(req.polyglot.t('403-assign'))
        }
    } else {
        res.status(404)
        throw new Error(req.polyglot.t('404-doc'))
    }
})

exports.loginUserValidate = [
    body('tokenId')
        .exists()
        .trim()
        .withMessage('is required')

        .notEmpty()
        .withMessage('cannot be blank'),
]