const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const friendController = require("../controller/friendController");

const { handleError, isLoggedIn } = require("../helpers/helper");

router.get("/addFriend/:friend_id", handleError(friendController.sendRequest));
router.get("/requests", handleError(friendController.friendRequests));
router.get(
  "/acceptRequest/:friend_id",
  handleError(friendController.acceptRequest)
);

router.get("/friends", handleError(friendController.myFriends));
router.get("/unfriend/:friend_id", handleError(friendController.unFriend));
module.exports = router;
