const asyncHandler = require('express-async-handler')

const Notification = require('../models/notificationModel')
const Document = require('../models/documentModel')
const User = require('../models/userModel')

exports.createNotification = asyncHandler(async (req, res) => {
    const { docId, userId } = req.body

    const document = await Document.findById(docId)
    const user = await User.findById(userId)

    if (document & user) {
        const notify = await Notification.create({
            userId: user._id,
            docId: document._id,
            author: req.user._id,
        })

        res.json(notify)
    } else {
        res.status(404)
        throw new Error(req.polyglot.t('404-doc'))
    }
})

exports.updateNotificationSeen = asyncHandler(async (req, res) => {
    const { docId, userId } = req.body

    const document = await Document.findById(docId)
    const user = await User.findById(userId)

    if (document & user) {
        if (req.user._id == userId) {
            await Notification
        }
        const notify = await Notification.create({
            userId: user._id,
            docId: document._id,
            author: req.user._id,
        })

        res.json(notify)
    } else {
        res.status(404)
        throw new Error(req.polyglot.t('404-doc'))
    }
})