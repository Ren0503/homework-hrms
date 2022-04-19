const router = require("express").Router()

const adminRoutes = require("./adminRoutes")
const docRoutes = require("./docRoutes")
const userRoutes = require("./userRoutes")
const notifyRoutes = require("./notifyRoutes")

router.use("/api/admin", adminRoutes)
router.use("/api/document", docRoutes)
router.use("/api/user", userRoutes)
router.use("/api/notifications", notifyRoutes)

module.exports = router