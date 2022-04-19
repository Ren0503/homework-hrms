const asyncHandler = require('express-async-handler')

const Notification = require('../models/notificationModel')
const Document = require('../models/documentModel')
const User = require('../models/userModel')

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private
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

        /*  #swagger.tags = ['Notification']
            #swagger.description = 'Endpoint to get the specific notification.' 
            #swagger.security = [{
                "Bearer": []
            }]
        */
        res.json(notify)
    } else {
        res.status(404)
        throw new Error(req.polyglot.t('404-doc'))
    }
})

// @desc    Update notifications
// @route   PUT /api/notifications/seen
// @access  Private
exports.updateNotificationSeen = asyncHandler(async (req, res) => {
    const notification = await Notification.updateMany({ userId: req.user, seen: false }, { seen: true }, { multi: true })

    /*  #swagger.tags = ['Notification']
        #swagger.description = 'Endpoint to get the specific notification.' 
        #swagger.security = [{
            "Bearer": []
        }]
    */
    res.json(notification)
})

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res) => {

    const notification = await Notification.findById(req.params.id)

    if (notification) {
        await notification.remove()

        /*  #swagger.tags = ['Notification']
            #swagger.description = 'Endpoint to get the specific notification.' 
            #swagger.security = [{
                "Bearer": []
            }]
        */
        res.json({ message: "Remove notify" })
    } else {
        res.status(404)
        throw new Error(req.polyglot.t('404-doc'))
    }
})

// @desc    Get notification for user
// @route   GET /api/notifications
// @access  Private
exports.getNotificationByUser = asyncHandler(async (req, res) => {
    const offset = Number(req.query.offset) || 1
    const limit = Number(req.query.limit) || 6

    const notifications = await Notification.find({ userId: req.user._id })
        .limit(limit)
        .skip(offset)
        .sort('-createdAt')

    /*  #swagger.tags = ['Notification']
        #swagger.description = 'Endpoint to get the specific notification.' 
        #swagger.security = [{
            "Bearer": []
        }]
    */
    res.json(notifications)
})