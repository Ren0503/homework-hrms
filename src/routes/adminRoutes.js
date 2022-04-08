const express = require('express')
const router = express.Router()

const AdminCtrl = require('../controllers/adminControllers')
const { protect, admin } = require('../middleware/authMiddleware')
const { blockIP } = require('../middleware/limitMiddleware')

/* NOTE: 100% automatic */
router.post('/login', blockIP, AdminCtrl.loginAdminValidate, AdminCtrl.loginForAdmin)

/* NOTE: 100% automatic */
router.route('/documents/:id/users')
    .get(protect, admin, AdminCtrl.getListUsersForDocument)

/* NOTE: 100% automatic */
router.route('/documents/:id/assign')
    .post(protect, admin, AdminCtrl.assignUserValidate, AdminCtrl.assignUserForDocument)

module.exports = router