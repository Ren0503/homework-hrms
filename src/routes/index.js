const router = require("express").Router();

const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const docRoutes = require("./docRoutes");
const userRoutes = require("./userRoutes");

router.use("/auth", authRoutes);
router.use("/api/admin", adminRoutes);
router.use("/api/document", docRoutes);
router.use("/api/user", userRoutes);

module.exports = router;