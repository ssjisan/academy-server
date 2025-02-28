const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Optional fields
  phone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  profileImage: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false, // Will be true after OTP verification
  },
  otp: {
    type: String, // Changed from Number to String to preserve leading zeros
    default: null, // Use null to indicate no OTP by default
  },
  otpExpiration: {
    type: Date,
    default: null, // Will be set when OTP is generated
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Student", studentSchema);
