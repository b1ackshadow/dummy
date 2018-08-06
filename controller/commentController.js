const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.commentForm = (req, res) => {
  res.render("commentForm", { postid: req.params.postid });
};

exports.newComment = async (req, res) => {
  let dummy = {
    ...req.body,
    post: req.params.postid,
    author: req.user._id
  };
  const comment = await new Comment(dummy);
  await comment.save();
  if (!comment) return res.redirect(`back`);
  res.redirect(`/post/${req.params.postid}`);
};

exports.editComment = async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.commentid });
  if (comment)
    return res.render("editForm", { comment, postid: req.params.postid });
  res.redirect("back");
};

exports.updateComment = async (req, res) => {
  const updatedComment = await Comment.findOneAndUpdate(
    { _id: req.params.commentid },
    req.body,
    {
      new: true
    }
  );
  if (!updatedComment) return res.redirect("back");
  res.redirect(`/post/${req.params.postid}`);
};

exports.deleteComment = async (req, res) => {
  const deletedComment = await Comment.findOneAndRemove({
    _id: req.params.commentid
  });
  console.log(deletedComment);
  if (!deletedComment) return res.redirect("/");
  res.redirect(`/post/${req.params.postid}`);
};

exports.newReply = async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.commentid });
  if (comment)
    return res.render("replyForm", { comment, postid: req.params.postid });
  res.redirect("back");
};

exports.addReply = async (req, res) => {
  const comment = await Comment.findOneAndUpdate(
    { _id: req.params.commentid },
    { children: true },
    {
      new: true
    }
  );
  if (comment) {
    const reply = await new Comment({
      ...req.body,
      parent: req.params.commentid,
      author: req.user._id
    });
    await reply.save();
    return res.redirect(`/post/${req.params.postid}`);
  }
  res.redirect(`/post/${req.params.postid}`);
};
