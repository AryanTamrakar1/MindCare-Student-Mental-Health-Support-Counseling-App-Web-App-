const express = require("express");
const router = express.Router();
const {
  getMoodAnalysis,
} = require("../controllers/smart/moodAnalysisController");
const { protect } = require("../controllers/authController");

router.get("/", protect, getMoodAnalysis);

module.exports = router;
