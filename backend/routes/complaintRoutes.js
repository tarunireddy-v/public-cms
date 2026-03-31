const express = require("express");
const {
  createComplaint,
  getAllComplaints,
  getComplaintsByUser,
  updateComplaintStatus,
  updateComplaint,
  predictDepartment,
} = require("../controllers/complaintController");

const router = express.Router();

router.post("/", createComplaint);
router.post("/predict-department", predictDepartment);
router.get("/", getAllComplaints);
router.get("/user/:userId", getComplaintsByUser);
router.put("/:id", updateComplaint);
router.patch("/:id/status", updateComplaintStatus);

module.exports = router;
