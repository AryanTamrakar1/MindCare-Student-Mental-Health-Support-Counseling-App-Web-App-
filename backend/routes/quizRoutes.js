const express = require("express");
const router = express.Router();
const {
  submitQuiz,
  checkQuiz,
  getMoodHistory,
  submitCheckIn,
  getCheckInHistory,
} = require("../controllers/quizController");
const { protect } = require("../controllers/authController");

router.post("/submit", protect, submitQuiz);
router.get("/check", protect, checkQuiz);
router.get("/history", protect, getMoodHistory);

router.post("/checkin", protect, submitCheckIn);
router.get("/checkin/history", protect, getCheckInHistory);

module.exports = router;