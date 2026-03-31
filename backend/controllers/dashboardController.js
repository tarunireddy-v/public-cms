const Complaint = require("../models/Complaint");

const getActiveCases = async (_req, res) => {
  try {
    const activeCases = await Complaint.countDocuments({
      status: { $ne: "Resolved" },
    });

    return res.status(200).json({ activeCases });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch active cases",
      error: error.message,
    });
  }
};

module.exports = {
  getActiveCases,
};
