const express = require("express");
const router = express.Router();
const {
  submitRating,
  checkRating,
  getCounselorRatings,
  getPublicCounselorRating,
} = require("../controllers/ratingController");
const { protect } = require("../controllers/authController");

// Route for Student to submit a rating for a completed session
router.post("/submit", protect, submitRating);

// Route for check if student has already submitted a rating for a session 
router.get("/check/:appointmentId", protect, checkRating);

// Route for Counselor to get a detailed breakdown of their ratings 
router.get("/my-ratings", protect, getCounselorRatings);

// Route for Students to see the counselor overall rating
router.get("/counselor/:counselorId", protect, getPublicCounselorRating);

module.exports = router;
