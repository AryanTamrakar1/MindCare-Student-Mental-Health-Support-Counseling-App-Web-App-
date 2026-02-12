const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const appointmentController = require("../controllers/appointmentController");

// Middleware
const { protect } = require("../controllers/authController");

// Route for Student to request a session
router.post("/request", protect, appointmentController.requestSession);

// Route for both Roles to see the sessions
router.get("/my-sessions", protect, appointmentController.getUserSessions);

// Route for Counselor to see pending requests
router.get("/pending", protect, appointmentController.getPendingRequests);

// Route for Counselor to accept/reject requests
router.put("/update-status", protect, appointmentController.updateStatus);

// Route for Counselor to check availability
router.get(
  "/check-availability",
  protect,
  appointmentController.checkAvailability,
);

// Route for checking live status of a counselor
router.get("/live-status/:counselorId", appointmentController.getLiveStatus);

module.exports = router;
