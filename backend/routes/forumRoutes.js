const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  addReply,
  editReply,
  iFeelThis,
  likeReply,
  deletePost,
  deleteReply,
} = require("../controllers/forumController");

const { protect } = require("../controllers/authController");

// Route to get all posts
router.get("/", protect, getAllPosts);

// Route to get a single post
router.get("/:id", protect, getPostById);

// Route to create a new post
router.post("/", protect, createPost);

// Route to add a reply to a post
router.post("/:id/reply", protect, addReply);

// Route to edit a reply
router.put("/:postId/reply/:replyId/edit", protect, editReply);

// Route to like a reply 1
router.put("/:id/ifeelthis", protect, iFeelThis);

// Route to like a reply 2
router.put("/:postId/reply/:replyId/like", protect, likeReply);

// Route to delete a post (admin or author)
router.delete("/:id", protect, deletePost);

// Route to delete a reply (admin)
router.delete("/:postId/reply/:replyId", protect, deleteReply);

module.exports = router;