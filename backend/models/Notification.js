const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    // --- Link to the User ---
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --- Notification ---
    title: { type: String, required: true },
    message: { type: String, required: true },

    // --- Type of Notification ---
    type: {
      type: String,
      enum: [
        "quiz_reminder",
        "checkin_reminder",
        "mood_decline",
        "session_reminder",
        "booking_request",
        "booking_approved",
        "booking_rejected",
        "new_post_reply",
        "general",
      ],
      required: true,
    },

    // --- Status ---
    isRead: { type: Boolean, default: false },

    link: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
