const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const userController = require("../controller/userController");
const handleError = fn => (...params) =>
  fn(...params).catch(error => console.log(error));

//auth routes
router.get("/register", userController.getRegisterForm);

router.post(
  "/register",
  handleError(userController.register),
  passport.authenticate("local"),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    //   console.log(req.user);
    res.redirect("/");
  }
);
router.get("/login", userController.loginForm);
router.post("/login", passport.authenticate("local"), function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  console.log(req.user);
  res.redirect("/");
});

router.get("/profile", handleError(userController.profile));

router.get("/logout", userController.logout);

router.get("/forgot", userController.forgotForm);
module.exports = router;
