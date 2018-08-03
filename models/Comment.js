const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  body: String,
  title: String,
  date: {
    type: Date,
    default: new Date()
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
});
function autopopulate(next) {
  this.populate("author");

  next();
}
commentSchema.pre("find", autopopulate);
commentSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Comment", commentSchema);
