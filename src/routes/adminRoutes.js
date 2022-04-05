const express = require('express')
const router = express.Router()

const AdminCtrl = require('../controllers/adminControllers')
const { protect, admin } = require('../middleware/authMiddleware')

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - avatar
 *         - role
 *       properties:
 *         _id:
 *           type: uuid
 *           description: The Auto-generated id of a user
 *         name:
 *           type: string
 *           description: name of user
 *         avatar:
 *           type: string
 *           description: avatar of user
 *         role:
 *           type: number
 *           descripton: role of user *
 *       example:
 *         _id: d35hr5t4hrt6h4r4hr6
 *         name: admin
 *         avatar: /avatar/23
 *         role: 9
 *
 */

/**
 * @swagger
 *  tags:
 *    name: Users
 *    description: list of users
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: login as admin
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: posts by its id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: post can not be found
 */
router.post('/login', AdminCtrl.loginForAdmin)

router.route('/documents/:id/users')
    .get(protect, admin, AdminCtrl.getListUsersForDocument)

router.route('/documents/:id/assign')
    .post(protect, admin, AdminCtrl.assignUserForDocument)

module.exports = router