const Complaint = require("../models/Complaint");

const getAdminStats = async (_req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({
      status: { $in: ["Submitted", "Assigned", "In Progress"] },
    });
    const resolved = await Complaint.countDocuments({ status: "Resolved" });

    console.log("Total:", total);
    console.log("Pending:", pending);
    console.log("Resolved:", resolved);

    const resolvedDocs = await Complaint.find(
      { status: "Resolved", createdAt: { $exists: true } },
      { createdAt: 1 }
    ).lean();

    let avgResponseTime = "0 Days";
    if (resolvedDocs.length > 0) {
      const avgDays =
        resolvedDocs.reduce((acc, row) => {
          const created = new Date(row.createdAt).getTime();
          const days = (Date.now() - created) / (1000 * 60 * 60 * 24);
          return acc + Math.max(days, 0);
        }, 0) / resolvedDocs.length;
      avgResponseTime = `${Number(avgDays.toFixed(1))} Days`;
    }

    return res.status(200).json({
      total,
      pending,
      resolved,
      avgResponseTime,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch admin stats",
      error: error.message,
    });
  }
};

const getAdminDepartments = async (_req, res) => {
  try {
    const departments = await Complaint.aggregate([
      { $match: { department: { $exists: true, $ne: "" } } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, name: "$_id", count: 1 } },
    ]);

    return res.status(200).json(departments);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch department breakdown",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getAdminDepartments,
};
