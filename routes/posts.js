const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware")

const router = express.Router();

router.get("/admin", auth, admin, async (req, res) => {
  try {
    const posts = await Post.find()
    .populate("author", "username")
    .populate({path: "comments", populate: { path: "user", select: "username"}})
    .sort({ createdAt: -1 });

    res.status(200).json(posts);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/user", auth, async (req, res) => {
  try {
    const posts = await Post.find({ published: true })
      .populate("author", "username")
      .populate({path: "comments", populate: { path: "user", select: "username"}})
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", async(req, res) => {
    try {
        const posts = await Post.find({published : true})
        .populate("author", "username")
        .sort({createdAt: -1});

        res.status(200).json(posts);
    } catch (err){
        res.status(500).json({message : "Server Error"})
    } 
})

router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        .populate("author", "username");

        if (!post || !post.published)
            return res.status(404).json({ message: "Post not found" });

        res.status(200).json(post);
    } catch (err){
        res.status(500).json({message : "Server Error"})
    } 
})

router.post("/", auth, admin, async(req, res) => {
   try {
    const {title, content, published} = req.body;
    if (!title || !content)
      return res.status(400).json({ message: "Title and content required" });

    const post = await Post.create({
        title,
        content,
        published,
        author : req.user.id
    })

    await post.save();
    res.status(201).json({message : "Post created successfully"})

   } catch(err) {
    res.status(500).json({message : "Failed to create Post"})
   }
})

router.put("/:id", auth, admin, async(req, res) => {
    try {

        const post = await Post.findById(req.params.id);
        if(!post ) {
            return res.status(404).json({message : "Post not found"})
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;

        await post.save();

        res.status(200).json(post);

    } catch(err) {
        res.status(500).json({message : "Failed to update Post"})
    }
})

router.put("/:id/publish", auth, admin, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({message : "Post not found"})
        }
        post.published = req.body.published !== undefined ? req.body.published : post.published;
        
        await post.save();
        res.status(200).json(post);

    } catch(err) {
        res.status(500).json({message : "Failed to update Post"})
    }
})

router.delete("/:id", auth, admin, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({message : "Post not found"})
        }
        await post.deleteOne();
        res.json({message : "Post deleted Successfully"})
        
    } catch(err) {
        res.status(500).json({message : "Failed to delete Post"})
    }
})

module.exports = router;