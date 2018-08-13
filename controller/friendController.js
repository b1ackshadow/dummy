const mongoose = require("mongoose");
const User = require("../models/User");
const { handleError } = require("../helpers/helper");

exports.sendRequest = async (req, res) => {
  const foundUser = await User.findOne({ _id: req.params.friend_id });
  if (foundUser) {
    await foundUser.toBeAccepted.push(req.user._id);
    const user = await User.findOne({ _id: req.user._id });
    await user.requestTo.push(foundUser._id);
    await user.save();
    await foundUser.save();
    res.redirect(`/profile/${foundUser._id}`);
  }
  res.redirect("back");
};

exports.friendRequests = async (req, res) => {
  console.log("friend req");
  const user = await User.findOne({ _id: req.user._id });
  console.log(user);
  if (user) return res.render("myRequests", { user });
  res.render("back");
};
exports.acceptRequest = async (req, res) => {
  const user1Promise = User.findOne({ _id: req.user._id });
  const user2Promise = User.findOne({ _id: req.params.friend_id });
  const [user1, user2] = await Promise.all([user1Promise, user2Promise]);
  await Promise.all([
    user2.friends.push(req.user._id),
    user2.requestTo.remove(req.user._id),
    user1.friends.push(req.params.friend_id),
    user1.toBeAccepted.remove(req.params.friend_id)
  ]);
  await Promise.all([user1.save(), user2.save()]);
  return res.redirect(`/requests`);
};

exports.myFriends = async (req, res) => {
  const friends = await User.findOne({ _id: req.user._id }).populate("friends");
  if (friends) return res.render("friends", { friends: friends.friends });
  res.redirect("back");
};

exports.unFriend = async (req, res) => {
  const user1Promise = User.findOne({ _id: req.user._id });
  const user2Promise = User.findOne({ _id: req.params.friend_id });
  const [user1, user2] = await Promise.all([user1Promise, user2Promise]);
  if (user1 && user2) {
    await Promise.all([
      user1.friends.remove(user2._id),
      user2.friends.remove(user1._id)
    ]);

    await Promise.all([user1.save(), user2.save()]);
  }
  res.redirect("/friends");
};
