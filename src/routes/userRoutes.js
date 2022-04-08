const express = require('express')
const router = express.Router()

const UserCtrl = require('../controllers/userControllers')
const { protect } = require('../middleware/authMiddleware')

router.post('/login', UserCtrl.loginUserValidate, UserCtrl.loginForUser)

/* NOTE: 100% automatic */
router.route('/documents')
    .get(protect, UserCtrl.getDocumentsByUser)

/* NOTE: 100% automatic */
router.route('/documents/:id/confirm')
    .get(protect, UserCtrl.confirmDocument)

module.exports = router