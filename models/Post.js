const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  body: String,
  title: String,
  date: {
    type: Date,
    default: new Date()
  },
  editing: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Post", postSchema);
