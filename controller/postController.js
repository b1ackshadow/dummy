const mongoose = require("mongoose");
const Post = require("../models/Post");
const dummy = [
  {
    title: "tittle1",
    body: "boandlsnadklad"
  },
  {
    title: "tittle1",
    body: "boandlsnadklad"
  },
  {
    title: "tittle1",
    body: "boandlsnadklad"
  }
];
exports.seedDB = async () => {
  await Post.insertMany(dummy);
};
exports.getAllPosts = async (req, res) => {
  const posts = await Post.find({}).sort("-date");

  res.json(posts);
  // res.render("landing", { posts });
};

exports.postForm = (req, res) => {
  res.render("newPost");
};

exports.newPost = async (req, res) => {
  const post = await new Post({
    title: req.body.title,
    body: req.body.body,
    author: req.user._id
  });
  await post.save();
  if (post) {
    return res.redirect("/");
  }
};
exports.getPost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  res.render("edit", { post });
};
exports.updatePost = async (req, res) => {
  const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true
  });
  if (!post) {
    return res.redirect("back");
  }
  res.redirect("/");
};

exports.deletePost = async (req, res) => {
  const deletedPost = await Post.findOneAndRemove({ _id: req.params.id });
  res.redirect("/");
};
