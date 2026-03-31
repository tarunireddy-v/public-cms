const express = require("express");
const { register, login, resetPasswordToDefault } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/debug/reset-password", resetPasswordToDefault);

module.exports = router;
