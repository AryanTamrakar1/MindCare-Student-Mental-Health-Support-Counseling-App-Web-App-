const mongoose = require("mongoose");

const dailyCheckInSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    mood: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },

    moodEmoji: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyCheckIn", dailyCheckInSchema);