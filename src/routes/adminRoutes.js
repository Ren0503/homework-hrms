const express = require('express')
const router = express.Router()

const AdminCtrl = require('../controllers/adminControllers')
const { protect, admin } = require('../middleware/authMiddleware')
const { blockIP } = require('../middleware/limitMiddleware')

/* NOTE: Completing informations automaticaly obtaineds */
router.post('/login', blockIP, AdminCtrl.loginAdminValidate, AdminCtrl.loginForAdmin)

/* NOTE: Completing informations automaticaly obtaineds */
router.route('/documents/:id/assign-users')
    .get(protect, admin, AdminCtrl.getAssignUsersForDocument)

/* NOTE: Completing informations automaticaly obtaineds */
router.route('/documents/:id/unassign-users')
    .get(protect, admin, AdminCtrl.getUnassignUsersForDocument)

/* NOTE: Completing informations automaticaly obtaineds */
router.route('/documents/:id/assign')
    .post(protect, admin, AdminCtrl.assignUserValidate, AdminCtrl.assignUserForDocument)

/* NOTE: Completing informations automaticaly obtaineds */
router.route('/documents/:id/unassign')
    .post(protect, admin, AdminCtrl.assignUserValidate, AdminCtrl.unassignUserForDocument)

module.exports = router