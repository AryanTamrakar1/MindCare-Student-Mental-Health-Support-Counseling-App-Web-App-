const express = require("express");
const router = express.Router();
const {
  getMoodPrediction,
} = require("../controllers/smart/moodPredictionController");
const { protect } = require("../controllers/authController");

router.get("/", protect, getMoodPrediction);

module.exports = router;
