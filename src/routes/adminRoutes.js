const express = require('express')
const router = express.Router()

const AdminCtrl = require('../controllers/adminControllers')
const { protect, admin } = require('../middleware/authMiddleware')

/* NOTE: 100% automatic */
router.post('/login', AdminCtrl.loginForAdmin)

/* NOTE: 100% automatic */
router.post('/register', AdminCtrl.registerUser)

/* NOTE: 100% automatic */
router.route('/documents/:id/users')
    .get(protect, admin, AdminCtrl.getListUsersForDocument)

/* NOTE: 100% automatic */
router.route('/documents/:id/assign')
    .post(protect, admin, AdminCtrl.assignUserForDocument)

module.exports = router