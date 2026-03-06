const express = require("express");
const router = express.Router();
const { getSmartResourceSuggestions } = require("../controllers/smart/resourceMatchController");
const { protect } = require("../controllers/authController");

router.get("/", protect, getSmartResourceSuggestions);

module.exports = router;