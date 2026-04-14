const express = require("express");
const router = express.Router();
const {
  submitRating,
  checkRating,
  getCounselorRatings,
  getPublicCounselorRating,
} = require("../controllers/ratingController");
const { protect } = require("../controllers/authController");

router.post("/submit", protect, submitRating);
router.get("/check/:appointmentId", protect, checkRating);
router.get("/my-ratings", protect, getCounselorRatings);
router.get("/counselor/:counselorId", protect, getPublicCounselorRating);

module.exports = router;
