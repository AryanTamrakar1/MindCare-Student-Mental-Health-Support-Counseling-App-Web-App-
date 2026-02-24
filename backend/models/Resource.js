const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    type: {
      type: String,
      enum: ["Video", "Article"],
      required: true,
    },
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
    estimatedTime: { type: String, required: true },
    description: { type: String, default: "" },
    isPriority: { type: Boolean, default: false },
    reactions: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reaction: { type: String, enum: ["helpful", "notHelpful"] },
      },
    ],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);