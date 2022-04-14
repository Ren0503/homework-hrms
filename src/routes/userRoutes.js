const express = require('express')
const router = express.Router()

const UserCtrl = require('../controllers/userControllers')
const { protect } = require('../middleware/authMiddleware')

/* NOTE: Completing informations automaticaly obtaineds */
router.post('/login', UserCtrl.loginUserValidate, UserCtrl.loginForUser)

/* NOTE: Completing informations automaticaly obtaineds */
router.route('/documents')
    .get(protect, UserCtrl.getDocumentsByUser)

/* NOTE: Completing informations automaticaly obtaineds */
router.route('/documents/:id/confirm')
    .get(protect, UserCtrl.confirmDocument)

module.exports = router