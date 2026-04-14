const mongoose = require("mongoose");

const moodQuizSchema = new mongoose.Schema(
  {
    // --- Link to the Student ---
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --- Week Label ---
    weekLabel: {
      type: String,
      required: true,
    },

    // --- Answers ---
    answers: [
      {
        questionText: { type: String },
        category: { type: String, default: "General" },
        score: { type: Number, min: 1, max: 5 },
      },
    ],

    // --- Mood Score ---
    moodScore: {
      type: Number,
    },

    // --- Mood Label ---
    moodLabel: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MoodQuiz", moodQuizSchema);