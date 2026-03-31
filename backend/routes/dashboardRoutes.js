const express = require("express");
const { getActiveCases } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/active-cases", getActiveCases);

module.exports = router;
