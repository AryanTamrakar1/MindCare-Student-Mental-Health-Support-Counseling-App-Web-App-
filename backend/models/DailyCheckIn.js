const mongoose = require("mongoose");

const dailyCheckInSchema = new mongoose.Schema(
  {
    // --- Link to the Student ---
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --- Date ---
    date: {
      type: String,
      required: true,
    },

    // --- Mood ---
    mood: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },

    // --- Mood Emoji ---
    moodEmoji: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyCheckIn", dailyCheckInSchema);