const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    type: {
      type: String,
      enum: [
        "quiz_reminder",
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

    isRead: { type: Boolean, default: false },

    link: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
