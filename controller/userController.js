const mongoose = require("mongoose");
const User = require("../models/User");
const { promisify } = require("es6-promisify");
const passport = require("passport");
const mail = require("../helpers/mail");
const crypto = require("crypto");

exports.getRegisterForm = (req, res) => {
  res.render("register");
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register).bind(User);
  try {
    await register(user, req.body.password);
    // pass to authController.login

    next();
  } catch (e) {
    console.log("error" + e);
    res.redirect("/register");
  }
};

exports.loginForm = (req, res) => {
  res.render("login");
};
exports.logout = (req, res) => {
  req.logout();
  //   req.flash("success", "You are now logged out! 👋");
  res.json(req.user);
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

exports.forgot = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.redirect("/login");
  }
  user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();
  const resetURL = `http://${req.headers.host}/account/reset/${
    user.resetPasswordToken
  }`;
  await mail.send({
    user,
    subject: "Password Reset",
    resetURL
  });
  res.redirect("/login");
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    return res.redirect("/login");
  }
  // if there is a user, show the rest password form
  res.render("reset", {
    title: "Reset your Password",
    token: req.params.token
  });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body["confirm-password"]) {
    next(); // keepit going!
    return;
  }
  res.redirect("back");
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.redirect("/login");
  }

  const setPassword = promisify(user.setPassword).bind(user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user
    .save()
    .then(updatedUser => {
      req.login(updatedUser);
      return res.redirect("/");
    })
    .catch(e => {
      console.log(e);
      return res.redirect("/");
    });
};
