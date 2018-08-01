const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const postController = require("../controller/postController");

const { handleError, isLoggedIn, postOwnership } = require("../helpers/helper");

router.get("/", handleError(postController.getAllPosts));

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

//auth routes

module.exports = router;
