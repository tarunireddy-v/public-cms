const Complaint = require("../models/Complaint");
const { classifyDepartmentAI } = require("../utils/aiClassifier");

const createComplaint = async (req, res) => {
  try {
    const { title, description, location, status, userId, image } = req.body;

    if (!title || !description || !location || !userId) {
      return res.status(400).json({
        message: "title, description, location and userId are required",
      });
    }

    const aiInput = `${title} ${description} ${location}`;
    console.log("AI createComplaint input:", aiInput);
    const department = await classifyDepartmentAI(aiInput);
    console.log("AI createComplaint department:", department);

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

const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, remarks } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (typeof status === "string" && status.trim()) {
      complaint.status = status;
    }
    if (typeof priority === "string" && priority.trim()) {
      complaint.priority = priority;
    }
    if (typeof remarks === "string") {
      complaint.remarks = remarks;
    }

    await complaint.save();
    console.log("Updated complaint:", complaint);

    return res.status(200).json(complaint);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update complaint", error: error.message });
  }
};

const predictDepartment = async (req, res) => {
  try {
    const { text = "" } = req.body;

    if (!String(text).trim()) {
      return res.status(400).json({ message: "text is required" });
    }

    console.log("AI predictDepartment input:", text);
    const department = await classifyDepartmentAI(text);
    console.log("AI predictDepartment output:", department);
    return res.status(200).json({ department });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to predict department", error: error.message });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintsByUser,
  updateComplaintStatus,
  updateComplaint,
  predictDepartment,
};
