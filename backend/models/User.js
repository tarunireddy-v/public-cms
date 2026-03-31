const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  residentId: {
    type: String,
    unique: true,
  },
  department: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["Citizen", "Admin", "Officer"],
    default: "Citizen",
  },
});

module.exports = mongoose.model("User", userSchema);
