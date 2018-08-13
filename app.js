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
const commentRoutes = require("./routes/comment.js");
const searchApi = require("./routes/search.js");
const friendRoutes = require("./routes/friends.js");
const fileUpload = require("express-fileupload");

const cors = require("cors");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

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
app.use(bodyParser.urlencoded({ extended: false }));
//pdf upload
// app.use(fileUpload());
app.use(
  session({
    secret: "mynameajeff",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 10 * 60
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.locals.currentUser = req.user ? req.user : null;
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  console.log(__dirname);
  next();
});
//our routes
app.use("/", authRoutes);
app.use("/", friendRoutes);
app.use("/", postRoutes);
app.use("/", commentRoutes);

//search api
app.use("/", searchApi);

// app.set("trust proxy", 1); // trust first proxy

module.exports = app;
