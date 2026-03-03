const express = require("express");
const router = express.Router();
const {
  getOverview,
  getSessionAnalytics,
  getUserAnalytics,
  getForumAnalytics,
  downloadReport,
} = require("../controllers/analyticsController");

router.get("/overview", getOverview);
router.get("/sessions", getSessionAnalytics);
router.get("/users", getUserAnalytics);
router.get("/forum", getForumAnalytics);
router.get("/report/download", downloadReport);

module.exports = router;
