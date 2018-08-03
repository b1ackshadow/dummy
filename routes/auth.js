const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const userController = require("../controller/userController");
const { handleError } = require("../helpers/helper");

//auth routes
router.get("/register", userController.getRegisterForm);

router.post(
  "/register",
  handleError(userController.register),
  passport.authenticate("local"),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    // console.log("registered" + req.user);
    res.json(req.user);
    // res.redirect("/");
  }
);
router.get("/login", userController.loginForm);
router.post("/login", passport.authenticate("local"), function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.json(req.user); // res.redirect("/");
});
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     successRedirect: "/"
//   })
// );

router.get("/profile", handleError(userController.profile));

router.get("/logout", userController.logout);

router.get("/forgot", userController.forgotForm);

router.post("/forgot", userController.forgot);
router.get("/account/reset/:token", handleError(userController.reset));
router.post(
  "/account/reset/:token",
  userController.confirmedPasswords,
  handleError(userController.update)
);

module.exports = router;
