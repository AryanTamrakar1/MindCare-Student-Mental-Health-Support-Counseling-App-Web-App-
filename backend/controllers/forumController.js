const Post = require("../models/Post");
const User = require("../models/User");
const { createNotification } = require("./notificationController");
const { awardPoints } = require("./gamificationController");

// --- Get All Posts ---
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// --- Get Single Post ---
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// --- Create Post ---
const createPost = async (req, res) => {
  try {
    const { title, content, category, moodTag } = req.body;

    const newPost = new Post({
      title,
      content,
      category,
      moodTag,
      authorId: req.user._id,
    });

    await newPost.save();

    if (req.user.role === "Student") {
      await awardPoints(req.user._id.toString(), "post");
    }

    res.status(201).json({ message: "Post created!", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// --- Add Reply ---
const addReply = async (req, res) => {
  try {
    const { content, parentReplyId } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    let authorName = null;
    let authorPhoto = null;

    if (req.user.role === "Counselor") {
      const counselor = await User.findById(req.user._id);
      authorName = counselor.name;
      authorPhoto = counselor.verificationPhoto;
    }

    let parentId = null;
    if (parentReplyId) {
      parentId = parentReplyId;
    }

    post.replies.push({
      content,
      authorId: req.user._id,
      authorRole: req.user.role,
      authorName,
      authorPhoto,
      parentReplyId: parentId,
    });

    await post.save();

    const replierId = req.user._id.toString();
    const postAuthorId = post.authorId.toString();

    if (parentReplyId) {
      let parentReplyAuthorId = null;

      for (let i = 0; i < post.replies.length; i++) {
        if (post.replies[i]._id.toString() === parentReplyId) {
          parentReplyAuthorId = post.replies[i].authorId.toString();
          break;
        }
      }

      if (parentReplyAuthorId && parentReplyAuthorId !== replierId) {
        await createNotification(
          parentReplyAuthorId,
          "Someone replied to your reply",
          "Someone replied to your reply in the community forum.",
          "new_post_reply",
          "/community-forum",
        );
      }
    } else {
      if (postAuthorId !== replierId) {
        await createNotification(
          postAuthorId,
          "Someone replied to your post",
          "Someone replied to your post in the community forum.",
          "new_post_reply",
          "/community-forum",
        );
      }
    }

    if (req.user.role === "Student") {
      await awardPoints(req.user._id.toString(), "reply");
    }

    res.json({ message: "Reply added!", post });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// --- Edit Reply ---
const editReply = async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reply = post.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const tenMinutes = 10 * 60 * 1000;
    const timeSinceCreated = Date.now() - new Date(reply.createdAt).getTime();
    if (timeSinceCreated > tenMinutes) {
      return res
        .status(403)
        .json({ message: "Edit window has expired (10 minutes)" });
    }

    if (reply.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    reply.content = content;
    await post.save();
    res.json({ message: "Reply updated!", post });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// --- I Feel This ---
const iFeelThis = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id.toString();

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    let alreadyClicked = false;
    for (let i = 0; i < post.iFeelThis.length; i++) {
      if (post.iFeelThis[i].toString() === userId) {
        alreadyClicked = true;
        break;
      }
    }

    if (alreadyClicked) {
      const newList = [];
      for (let i = 0; i < post.iFeelThis.length; i++) {
        if (post.iFeelThis[i].toString() !== userId) {
          newList.push(post.iFeelThis[i]);
        }
      }
      post.iFeelThis = newList;
    } else {
      post.iFeelThis.push(req.user._id);
      if (req.user.role === "Student") {
        await awardPoints(req.user._id.toString(), "like");
      }
    }

    await post.save();
    res.json({ iFeelThisCount: post.iFeelThis.length });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// --- Like Reply ---
const likeReply = async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const userId = req.user._id.toString();

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reply = post.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    let alreadyLiked = false;
    for (let i = 0; i < reply.likes.length; i++) {
      if (reply.likes[i].toString() === userId) {
        alreadyLiked = true;
        break;
      }
    }

    if (alreadyLiked) {
      const newLikes = [];
      for (let i = 0; i < reply.likes.length; i++) {
        if (reply.likes[i].toString() !== userId) {
          newLikes.push(reply.likes[i]);
        }
      }
      reply.likes = newLikes;
    } else {
      reply.likes.push(req.user._id);
      const replyAuthorId = reply.authorId.toString();
      const isFirstLike = reply.likes.length === 1;
      if (isFirstLike && replyAuthorId !== userId) {
        await awardPoints(replyAuthorId, "helped");
      }
    }

    await post.save();
    res.json({ likesCount: reply.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// --- Delete Post ---
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isAdmin = req.user.role === "Admin";
    const isAuthor = post.authorId.toString() === req.user._id.toString();

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// --- Delete Reply ---
const deleteReply = async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const remainingReplies = [];
    for (let i = 0; i < post.replies.length; i++) {
      const reply = post.replies[i];
      const isTheDeletedReply = reply._id.toString() === replyId;
      let isChildOfDeletedReply = false;
      if (reply.parentReplyId) {
        isChildOfDeletedReply = reply.parentReplyId.toString() === replyId;
      }

      if (!isTheDeletedReply && !isChildOfDeletedReply) {
        remainingReplies.push(reply);
      }
    }

    post.replies = remainingReplies;
    await post.save();
    res.json({ message: "Reply deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  addReply,
  editReply,
  iFeelThis,
  likeReply,
  deletePost,
  deleteReply,
};
