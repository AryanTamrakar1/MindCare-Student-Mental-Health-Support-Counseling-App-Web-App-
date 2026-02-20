const mongoose = require("mongoose");

// --- Reply Schema ---
const replySchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorRole: { type: String, enum: ["Student", "Counselor"] },
    authorName: { type: String, default: null },
    authorPhoto: { type: String, default: null },
    parentReplyId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

// -- Post Schema --
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },

    category: {
      type: String,
      required: true,
      enum: [
        "Academic & Exam Pressure",
        "Skill Gap & Job Anxiety",
        "Family & Social Pressure",
        "Emotional & Personal Issues",
        "Sleep & Physical Wellbeing",
        "General Mental Health",
      ],
    },

    moodTag: {
      type: String,
      required: true,
      enum: ["Overwhelmed", "Struggling", "Confused", "Frustrated", "Hopeful"],
    },

    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    iFeelThis: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    replies: [replySchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
