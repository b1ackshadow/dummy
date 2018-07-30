const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
// const handleError = require("../handlers/errorHandlers");
const postController = require("../controller/postController");
// const userController = require("../controller/userController");
// const authController = require("../controller/authController");

const handleError = fn => (...params) =>
  fn(...params).catch(error => console.log(error));

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  next();
};

router.get("/", isLoggedIn, handleError(postController.getAllPosts));

router.get("/post/newPost", isLoggedIn, postController.postForm);
router.post("/post", isLoggedIn, handleError(postController.newPost));

router.get("/post/:id/edit", isLoggedIn, handleError(postController.getPost));

router.put("/post/:id", isLoggedIn, handleError(postController.updatePost));

router.delete("/post/:id", isLoggedIn, handleError(postController.deletePost));

//auth routes

module.exports = router;
