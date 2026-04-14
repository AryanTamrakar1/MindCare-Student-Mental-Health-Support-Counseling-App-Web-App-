const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    // --- Basic Information ---
    title: { type: String, required: true },

    // --- Link ---
    link: { type: String, required: true },

    // --- Type ---
    type: {
      type: String,
      enum: ["Video", "Article"],
      required: true,
    },

    // --- Category ---
    category: {
      type: String,
      enum: [
        "General Mental Health",
        "Exam & Academic Pressure",
        "Skill Gap & Career Fear",
        "Family Expectation Burden",
        "Sleep & Energy",
        "Social Isolation",
        "Low Motivation",
      ],
      required: true,
    },

    // --- Estimated Time ---
    estimatedTime: { type: String, default: "" },

    // --- Description ---
    description: { type: String, default: "" },

    // --- Priority Flag ---
    isPriority: { type: Boolean, default: false },

    // --- Student Reactions ---
    reactions: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reaction: { type: String, enum: ["helpful", "notHelpful"] },
      },
    ],

    // --- Bookmarks ---
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);