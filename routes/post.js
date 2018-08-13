const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const postController = require("../controller/postController");

const { handleError, isLoggedIn, postOwnership } = require("../helpers/helper");
router.get("/chat", postController.chat);
router.get(
  "/getNew/:LatestPostId",
  isLoggedIn,
  handleError(postController.getNewPosts)
);
router.get("/", isLoggedIn, handleError(postController.getAllPosts));
//pagination or infinite scrolling postCOunt or pageCount
router.get("/:postCount", isLoggedIn, handleError(postController.getAllPosts));

router.get("/post/newPost", isLoggedIn, postController.postForm);
var fileupload = require("fileupload").createFileUpload(
  `${__dirname}/../public/uploads/`
).middleware;

router.post(
  "/post",
  isLoggedIn,
  fileupload,
  handleError(postController.newPost)
);

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

//heart post

router.get(
  "/post/:id/heart",
  postOwnership,
  handleError(postController.heartPost)
);
router.get(
  "/post/:id/unheart",
  postOwnership,
  handleError(postController.unHeartPost)
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
//chat routes
module.exports = router;
