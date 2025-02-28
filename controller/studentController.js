// controllers/studentController.js
const Student = require("../modal/studentModal.js");
const sendOtpEmail = require("../helper/sendOtpEmail.js");
const { hashPassword,comparePassword } = require("../helper/hashPassword.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate JWT Token
const generateToken = (student) => {
  return jwt.sign({ id: student._id }, process.env.JWT_SECURE, {
    expiresIn: "7d",
  });
};

// Student Registration Controller
const studentRegistration = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    // Check if the name is provided
    if (!name.trim()) {
      return res.status(400).json({ message: "Name is required." });
    }

    // Check if the email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Check if the password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    // Check if the confirmPassword is provided
    if (!confirmPassword) {
      return res.status(400).json({ message: "Confirm password is required." });
    }

    // Check if email is valid
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address." });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Password validation: Minimum 8 characters, 1 number, 1 special character
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain at least one number, and one special character.",
      });
    }

    // Check if email is already registered
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "এই ইমেইলটি ইতিমধ্যেই নিবন্ধিত" });
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);

    // Generate OTP and set expiration time
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 90 * 1000); // 1.5 minutes expiration time

    // Create the new student record
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiration,
    });

    // Save the new student and send OTP email
    await newStudent.save();
    await sendOtpEmail(email, otp);

    // Send success response
    res.status(201).json({ message: "An OTP sent to email." });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json(error.message);
  }
};

// OTP Verification Controller
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    if (student.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (student.otpExpiration < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please register again." });
    }
    // Convert both to strings for comparison
    if (student.otp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    student.otp = ""; // Clear OTP after successful verification
    student.otpExpiration = null;
    student.isVerified = true;
    await student.save();

    const token = generateToken(student);
    res.status(200).json({
      token,
      user: {
        _id: student._id,
        name: student.name,
        email: student.email,
      },
    });
    
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Resend OTP Controller
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body; // Get email from request body

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Check if the email is already registered
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set the expiration date to 1.5 minutes from now
    const otpExpiration = new Date(Date.now() + 90 * 1000); // 1.5 minutes expiration time

    // Update OTP and expiration date in the database
    student.otp = otp;
    student.otpExpiration = otpExpiration;
    await student.save();

    // Send OTP email to the student
    await sendOtpEmail(email, otp);

    // Respond with success
    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//  Login Function

const studentLogin = async (req, res) => {
  try {
    // 1. destruct the element
    const { email, password } = req.body;
    
    // 2. Add Validation
    if (!email) {
      return res.json({ error: "Email is required" });
    }

    const user = await Student.findOne({ email });
    if (!user) {
      return res.json({ error: "No account found" });
    }
    // 4. Hased the password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({ error: "Wrong Password" });
    }

    // 5. Use JWT for auth
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECURE, {
      expiresIn: "7d",
    });
    // 6. Save User
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
  }
};

module.exports = { studentRegistration, verifyOtp, resendOtp,studentLogin };