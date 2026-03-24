require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

console.log("MONGO_URI:", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error(
    "Error: MONGO_URI is undefined. Add MONGO_URI to your .env file (e.g. mongodb://127.0.0.1:27017/yourdb or mongodb+srv://...)."
  );
  process.exit(1);
}

const mongooseOptions = {
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10,
};

mongoose
  .connect(process.env.MONGO_URI, mongooseOptions)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    console.error("MongoDB error details:", {
      name: error.name,
      code: error.code,
      codeName: error.codeName,
    });
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  });
