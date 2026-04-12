const mongoose = require("mongoose");

const moodQuizSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    weekLabel: {
      type: String,
      required: true,
    },

    answers: [
      {
        questionText: { type: String },
        category: { type: String, default: "General" },
        score: { type: Number, min: 1, max: 5 },
      },
    ],

    moodScore: {
      type: Number,
    },

    moodLabel: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MoodQuiz", moodQuizSchema);