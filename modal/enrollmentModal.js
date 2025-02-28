const mongoose = require("mongoose");

const enrollmentHistorySchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for referencing student
    required: true,
    ref: "Student", // Reference the Course model
  },
  bkashNumber: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    unique: true,
    default: "",
  },
  isEnrolled: {
    type: Boolean,
    default: false, // Will be true after OTP verification
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Enrollment", enrollmentHistorySchema);
