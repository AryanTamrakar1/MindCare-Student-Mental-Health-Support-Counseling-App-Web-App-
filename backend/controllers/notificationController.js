const Notification = require("../models/Notification");

// It fetches the latest 20 notifications for the logged-in user
async function getNotifications(req, res) {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, notifications });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to get notifications" });
  }
}

// It returns the number of unread notifications for the logged-in user
async function getUnreadCount(req, res) {
  try {
    const userId = req.user.id;
    const count = await Notification.countDocuments({
      userId: userId,
      isRead: false,
    });
    res.json({ success: true, count });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to get unread count" });
  }
}

// It marks a single notification as read
async function markAsRead(req, res) {
  try {
    const notificationId = req.params.id;
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    res.json({ success: true, message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
}

// It marks all unread notifications as read for the logged-in user
async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id;
    await Notification.updateMany(
      { userId: userId, isRead: false },
      { isRead: true },
    );
    res.json({ success: true, message: "All marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to mark all as read" });
  }
}

// It deletes a single notification by its ID
async function deleteNotification(req, res) {
  try {
    const notificationId = req.params.id;
    await Notification.findByIdAndDelete(notificationId);
    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete notification" });
  }
}

// It deletes all notifications for the logged-in user
async function deleteAllNotifications(req, res) {
  try {
    const userId = req.user.id;
    await Notification.deleteMany({ userId: userId });
    res.json({ success: true, message: "All notifications deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete all notifications" });
  }
}

// It creates and saves a new notification for a given user — used internally across controllers
async function createNotification(userId, title, message, type, link = "") {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      link,
    });
    await notification.save();
  } catch (error) {
    console.log("Failed to create notification:", error.message);
  }
}

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  createNotification,
};
