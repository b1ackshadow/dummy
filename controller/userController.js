const mongoose = require("mongoose");
const User = require("../models/User");
const { promisify } = require("es6-promisify");
const passport = require("passport");
exports.getRegisterForm = (req, res) => {
  res.render("register");
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register).bind(User);
  await register(user, req.body.password);

  next(); // pass to authController.login
};

exports.loginForm = (req, res) => {
  res.render("login");
};
exports.logout = (req, res) => {
  req.logout();
  //   req.flash("success", "You are now logged out! 👋");
  res.redirect("/");
};

exports.profile = async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const user = await User.findById(req.user._id);
  console.log(req.user);
  res.json(req.user);
};

exports.forgotForm = (req, res) => {
  res.render("forgot");
};
