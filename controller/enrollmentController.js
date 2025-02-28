const Enrollment = require("../modal/enrollmentModal.js");
const Student = require("../modal/studentModal.js");

const createEnrollment = async (req, res) => {
  try {
    const { bkashNumber, transactionId, courseName, studentId } = req.body;

    // Check for required fields
    if (!bkashNumber || !transactionId || !courseName || !studentId) {
      return res.status(400).json({ error: "সবগুলো ঘর পূরণ করা বাধ্যতামূলক" });
    }

    // Check if the student exists
    const studentExists = await Student.findById(studentId);
    if (!studentExists) {
      return res.status(404).json({ error: "শিক্ষার্থী পাওয়া যায়নি" });
    }

    // Check if the transaction ID has already been used
    const existingTransaction = await Enrollment.findOne({ transactionId });
    if (existingTransaction) {
      return res.status(409).json({ error: "এই ট্রানজেকশন আইডি ইতিমধ্যেই ব্যবহৃত হয়েছে" });
    }

    // Check if the user has already enrolled in the same course
    const existingEnrollment = await Enrollment.findOne({ studentId, courseName });
    if (existingEnrollment) {
      return res.status(409).json({ error: "আপনি ইতিমধ্যেই এই কোর্সে এনরোল করেছেন" });
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      courseName,
      studentId,
      bkashNumber,
      transactionId,
      isEnrolled: false,
    });

    await enrollment.save();

    res.status(201).json({
      message: "এনরোলমেন্ট সফল হয়েছে। এপ্রুভালের জন্য অপেক্ষা করুন।",
      enrollment,
    });
  } catch (err) {
    console.error("Enrollment Creation Error:", err);
    res.status(500).json({ error: "সার্ভারে সমস্যা হয়েছে, অনুগ্রহ করে পরে চেষ্টা করুন" });
  }
};

module.exports = { createEnrollment };
