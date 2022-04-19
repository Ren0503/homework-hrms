const express = require('express')
const router = express.Router()

const NotifyCtrl = require('../controllers/notificationController')
const { protect, admin } = require('../middleware/authMiddleware')

/* NOTE: Completing informations automaticaly obtaineds */
router.route('/')
    .post(protect, NotifyCtrl.createNotification)
    .get(protect, NotifyCtrl.getNotificationByUser)

/* NOTE: Completing informations automaticaly obtaineds */
router.route('/seen')
    .put(protect, NotifyCtrl.updateNotificationSeen)

/* NOTE: Completing informations automaticaly obtaineds */
router.route('/:id')
    .delete(protect, NotifyCtrl.deleteNotification)

module.exports = router