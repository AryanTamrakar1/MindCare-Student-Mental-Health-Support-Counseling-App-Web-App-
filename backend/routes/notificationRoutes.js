const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");

const { protect } = require("../controllers/authController");

router.get("/unread-count", protect, getUnreadCount);
router.put("/mark-all-read", protect, markAllAsRead);
router.delete("/delete-all", protect, deleteAllNotifications);
router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;