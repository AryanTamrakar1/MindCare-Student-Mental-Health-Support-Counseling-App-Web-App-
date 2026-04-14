const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const appointmentController = require("../controllers/appointmentController");
const { protect } = require("../controllers/authController");

router.post("/request", protect, appointmentController.requestSession);
router.get("/my-sessions", protect, appointmentController.getUserSessions);
router.get("/pending", protect, appointmentController.getPendingRequests);
router.put("/update-status", protect, appointmentController.updateStatus);
router.get(
  "/check-availability",
  protect,
  appointmentController.checkAvailability,
);
router.get("/live-status/:counselorId", appointmentController.getLiveStatus);
router.get(
  "/completed-count/:counselorId",
  appointmentController.getCompletedCount,
);

module.exports = router;
