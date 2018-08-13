const mongoose = require("mongoose");
const User = require("../models/User");
const { promisify } = require("es6-promisify");
const passport = require("passport");
const mail = require("../helpers/mail");
const crypto = require("crypto");
const multer = require("multer");
const uuid = require("uuid");
const jimp = require("jimp");

//multer oprtions for like memory storage and file mimetype check
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    console.log(file);
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "That filetype isn't allowed!" }, false);
    }
  }
};

exports.upload = multer(multerOptions).single("photo");

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    return next(); // skip to the next middleware
  }
  const extension = req.file.mimetype.split("/")[1];
  //created a random generated string as image name
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(400, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};
exports.getRegisterForm = (req, res) => {
  res.render("register");
};

exports.register = async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    photo: req.body.photo
  });
  // console.log(`REgistering data ${req.body}`);
  const register = promisify(User.register).bind(User);
  console.log(user);

  try {
    let user1 = await register(user, req.body.password);
    // pass to authController.login
    console.log(user1);
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
  const user = await User.findById(req.params.userId);
  // res.json(user);
  res.render("profile", { user });
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
