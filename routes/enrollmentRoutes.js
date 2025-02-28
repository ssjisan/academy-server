// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const { createEnrollment } = require("../controller/enrollmentController.js");
const { requiredSignIn } = require("../helper/authHelper.js");

router.post("/enrollment", requiredSignIn, createEnrollment);

module.exports = router;
