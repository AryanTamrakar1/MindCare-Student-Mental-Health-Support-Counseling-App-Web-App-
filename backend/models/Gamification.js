const mongoose = require("mongoose");
const gamificationSchema = new mongoose.Schema(
  {
    // --- Student ID ---
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // --- Points ---
    points: {
      type: Number,
      default: 0,
    },

    // --- Level (1 to 5) ---
    level: {
      type: Number,
      default: 1,
    },

    // --- Badges and Letters ---
    badges: [
      {
        name: { type: String },
        earnedAt: { type: Date, default: Date.now },
      },
    ],

    milestoneLetters: [
      {
        badgeName: { type: String },
        letterText: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // --- Rest Day System ---
    restDaysUsed: {
      type: Number,
      default: 0,
    },

    //-- Track when rest days were last reset ---
    lastRestDayReset: {
      type: Date,
      default: Date.now,
    },
    lastRestDayDate: {
      type: String,
      default: null,
    },
    // --- Streak tracking ---
    currentStreak: {
      type: Number,
      default: 0,
    },

    lastActivityDate: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Gamification", gamificationSchema);
