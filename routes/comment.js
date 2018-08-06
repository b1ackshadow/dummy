const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const commentController = require("../controller/commentController");

const { handleError, isLoggedIn } = require("../helpers/helper");
router.get("/post/:postid/newComment", commentController.commentForm);
router.post("/post/:postid", handleError(commentController.newComment));

router.get(
  "/post/:postid/comment/:commentid/edit",
  handleError(commentController.editComment)
);

router.put(
  "/post/:postid/comment/:commentid",
  handleError(commentController.updateComment)
);

router.delete(
  "/post/:postid/:commentid",
  handleError(commentController.deleteComment)
);

router.get(
  "/post/:postid/comment/:commentid/newReply",
  handleError(commentController.newReply)
);
router.post(
  "/post/:postid/comment/:commentid",
  handleError(commentController.addReply)
);

module.exports = router;
