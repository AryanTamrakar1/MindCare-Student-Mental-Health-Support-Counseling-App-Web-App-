const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const { protect } = require("../controllers/authController");


router.post("/approve", protect, sessionController.approveAndCreateZoom);
router.post("/start", protect, sessionController.startSession);
router.post("/end", protect, sessionController.endSession);
router.post("/join", protect, sessionController.joinSession);
router.post("/summary", protect, sessionController.saveSummary);
router.get("/summary/:appointmentId", protect, sessionController.getSummary);

module.exports = router;
