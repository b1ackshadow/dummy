const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const postController = require("../controller/postController");

const { handleError, isLoggedIn, postOwnership } = require("../helpers/helper");

router.get("/:postCount", isLoggedIn, handleError(postController.getAllPosts));

router.get("/post/newPost", isLoggedIn, postController.postForm);
router.post("/post", isLoggedIn, handleError(postController.newPost));

router.get(
  "/post/:id/edit",
  postOwnership,
  handleError(postController.getPost)
);

router.put("/post/:id", postOwnership, handleError(postController.updatePost));

router.delete(
  "/post/:id",
  postOwnership,
  handleError(postController.deletePost)
);

//view post
router.get(
  "/post/:postid",
  handleError(async (req, res) => {
    const post = await Post.findOne({ _id: req.params.postid });
    if (!post) return res.redirect("back");
    // res.json(post.comments);
    res.render("viewPost", { post });
    // res.json(post);
  })
);
//auth routes

module.exports = router;
