const express = require("express");
const router = express.Router();
const { getSmartQuestions } = require("../controllers/smart/smartQuizController");
const { protect } = require("../controllers/authController");

router.get("/", protect, getSmartQuestions);

module.exports = router;