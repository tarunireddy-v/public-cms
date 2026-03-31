const express = require("express");
const { getAdminStats, getAdminDepartments } = require("../controllers/adminController");

const router = express.Router();

router.get("/stats", getAdminStats);
router.get("/departments", getAdminDepartments);

module.exports = router;
