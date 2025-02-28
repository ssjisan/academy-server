// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const {
  studentRegistration,
  verifyOtp,
  resendOtp,
  studentLogin
} = require("../controller/studentController.js");
const {requiredSignIn}=require("../helper/authHelper.js")

router.post("/register", studentRegistration);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", studentLogin);
router.get("/auth-check", requiredSignIn, (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
