const Post = require("../models/Post");
exports.handleError = fn => (...params) =>
  fn(...params).catch(error => console.log(error));

exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  next();
};

exports.postOwnership = async (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  const post = await Post.findOne({ _id: req.params.id });
  if (!post) return res.send("no post with that id");
  if (post.author._id.equals(req.user._id)) {
    next();
  } else {
    res.send("u dont have permission");
  }
};
