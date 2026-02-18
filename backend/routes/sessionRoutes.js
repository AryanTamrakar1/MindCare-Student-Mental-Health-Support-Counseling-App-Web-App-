const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const { protect } = require("../controllers/authController");

// Counselor approves session AND creates Zoom link
router.post("/approve", protect, sessionController.approveAndCreateZoom);

// Counselor clicks "Start Session" button
router.post("/start", protect, sessionController.startSession);

// Counselor clicks "End Session" button
router.post("/end", protect, sessionController.endSession);

// Student clicks "Join Meeting" button
router.post("/join", protect, sessionController.joinSession);

// Counselor saves session summary after ending the session
router.post("/summary", protect, sessionController.saveSummary);

// Student views session summary after the session is completed
router.get("/summary/:appointmentId", protect, sessionController.getSummary);

module.exports = router;
