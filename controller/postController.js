const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");
const uuid = require("uuid");

const { handleError } = require("../helpers/helper");

const dummy = [
  {
    title: "tittle1",
    body: "boandlsnadklad"
  },
  {
    title: "tittle1",
    body: "boandlsnadklad"
  },
  {
    title: "tittle1",
    body: "boandlsnadklad"
  }
];

exports.pdfUpload = async (req, res, next) => {
  console.log(req.body);
  let pdf = req.file.photo;
  if (!pdf) return;
  const extension = req.file.mimetype.split("/")[1];
  //created a random generated string as image name
  req.body.photo = `${uuid.v4()}.${extension}`;
  console.log(req.body.photo);
  await pdf.mv(`./public/uploads/${req.body.photo}`);

  next();
};

exports.seedDB = async () => {
  await Post.insertMany(dummy);
};
exports.getAllPosts = async (req, res) => {
  let skip_count = 3 * req.params.postCount || 0;
  const posts = await Post.find({
    $or: [
      {
        author: req.user._id
      },
      {
        author: { $in: req.user.friends }
      }
    ]
  })
    .sort("-date")
    .skip(skip_count)
    .limit(3);
  res.json(posts);
  // res.render("landing", { posts });
};

exports.postForm = (req, res) => {
  res.render("newPost");
};

exports.newPost = async (req, res) => {
  const post = await new Post({
    body: req.body.body,
    author: req.user._id,
    photo: req.body.photo
  });

  // const [post, author] = await Promise.all([new postPromise(), userPromise]);
  await post.save();
  console.log("post prom" + post);

  if (post) {
    return res.json(post);
  }
};
exports.getPost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  res.render("edit", { post });
};
exports.updatePost = async (req, res) => {
  const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true
  });
  if (!post) {
    return res.redirect("back");
  }
  res.redirect("/");
};

exports.deletePost = async (req, res) => {
  const deletedPost = await Post.findOneAndRemove({ _id: req.params.id });
  res.redirect("/");
};

exports.chat = (req, res) => {
  console.log("chat");
  res.render("chat");
};

exports.getNewPosts = async (req, res) => {
  let skip = 0,
    count = 0,
    newPosts = [];

  let postid = req.params.LatestPostId;
  const fetchNewPosts = handleError(async skip => {
    const posts = await Post.findOne({})
      .sort("-date")
      .skip(skip)
      .limit(3);
    console.log(posts + "    " + postid);
    if (post.length !== 0) {
      await posts.map(post => {
        if (post && post._id.equals(postid)) {
          return;
        }
        skip++;
        newPosts.push(post);
      });
      await fetchNewPosts(skip);
    }

    //  else if (post.length === 0) return;
  });
  await fetchNewPosts(skip);
  res.json(newPosts);
};

exports.heartPost = async (req, res) => {
  const heartedPost = await Post.findOne({ _id: req.params.id });
  let index = heartedPost.hearts.indexOf(req.user._id);
  if (index == -1) {
    heartedPost.hearts.push(req.user._id);
  } else heartedPost.hearts.splice(index, 1);
  await heartedPost.save();
  console.log(` hearted pis ${heartedPost}`);
  res.json(heartedPost);
};
