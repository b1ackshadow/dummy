const express = require("express");
const app = express();
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ejs = require("ejs");
const fs = require("fs");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const User = require("./models/User");
const postRoutes = require("./routes/post.js");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
// const authRoutes = require("./routes/authroutes.js");
//for put and delete
app.use(methodOverride("_method"));

//setting templating engine as ejs
app.set("view engine", "ejs");

//our static files like images ,css etc
app.use(express.static("public"));

//auth config for passport
app.use(cookieParser());

//body parser populates req.body with whatever user submitted in the form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "mynameajeff",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { secure: true, maxAge: 5000 }
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.user = req.user ? req.user : null;

  next();
});
//our routes
app.use("/", postRoutes);
app.use("/", authRoutes);
module.exports = app;
