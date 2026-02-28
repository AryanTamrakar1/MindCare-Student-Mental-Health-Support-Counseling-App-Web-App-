const express = require("express");
const router = express.Router();
const { protect } = require("../controllers/authController");
const {
  getGamificationData,
  getLetters,
  useRestDay,
} = require("../controllers/gamificationController");

router.get("/me", protect, getGamificationData);

router.get("/letters", protect, getLetters);

router.put("/rest-day", protect, useRestDay);

module.exports = router;
