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


router.get("/", protect, getAllPosts);
router.get("/:id", protect, getPostById);
router.post("/", protect, createPost);
router.post("/:id/reply", protect, addReply);
router.put("/:postId/reply/:replyId/edit", protect, editReply);
router.put("/:id/ifeelthis", protect, iFeelThis);
router.put("/:postId/reply/:replyId/like", protect, likeReply);
router.delete("/:id", protect, deletePost);
router.delete("/:postId/reply/:replyId", protect, deleteReply);

module.exports = router;