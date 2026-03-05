const express = require("express");
const router = express.Router();
const {
  getSmartCounselorSuggestions,
} = require("../controllers/smart/counselorMatchController");
const { protect } = require("../controllers/authController");

router.get("/", protect, getSmartCounselorSuggestions);

module.exports = router;
