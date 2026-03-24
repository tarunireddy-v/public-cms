const express = require("express");
const {
  createComplaint,
  getAllComplaints,
  getComplaintsByUser,
  updateComplaintStatus,
} = require("../controllers/complaintController");

const router = express.Router();

router.post("/", createComplaint);
router.get("/", getAllComplaints);
router.get("/user/:userId", getComplaintsByUser);
router.patch("/:id/status", updateComplaintStatus);

module.exports = router;
