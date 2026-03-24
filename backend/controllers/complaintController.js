const Complaint = require("../models/Complaint");
const { classifyDepartment } = require("../utils/classifier");

const createComplaint = async (req, res) => {
  try {
    const { title, description, location, status, userId, image } = req.body;

    if (!title || !description || !location || !userId) {
      return res.status(400).json({
        message: "title, description, location and userId are required",
      });
    }

    const department = classifyDepartment(`${title} ${description} ${location}`);

    const complaint = await Complaint.create({
      title,
      description,
      location,
      department,
      status,
      userId,
      image,
    });

    return res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create complaint", error: error.message });
  }
};

const getAllComplaints = async (_req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    return res.status(200).json(complaints);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
};

const getComplaintsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(complaints);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch user complaints", error: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    return res.status(200).json({
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update complaint status", error: error.message });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintsByUser,
  updateComplaintStatus,
};
