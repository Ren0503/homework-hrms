const express = require('express')
const router = express.Router()

const UserCtrl = require('../controllers/userControllers')
const { protect } = require('../middleware/authMiddleware')

router.route('/documents')
    .get(protect, UserCtrl.getDocumentsByUser)

router.route('/documents/:id/confirm')
    .get(protect, UserCtrl.confirmDocument)

router.route('/documents/:id')
    .get(protect, UserCtrl.readingDocument)

module.exports = router