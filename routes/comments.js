const express = require("express");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username")
      .populate("post", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments" });
  }
});

router.post("/:postId", auth, async (req, res) => {
  try {
    const {comment} = req.body;

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = await Comment.create({
      comment,
      post: req.params.postId,
      user: req.user.id
    });

    await newComment.save();

    await Post.findByIdAndUpdate(req.params.postId, {
      $push: { comments: newComment._id },
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Error creating comment" });
  }
});


router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting comment" });
  }
});

module.exports = router;