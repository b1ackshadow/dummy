const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
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
    },
    children: {
      type: Boolean,
      default: false
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parent"
});
function autopopulate(next) {
  this.populate("author");

  this.populate("replies");

  next();
}

commentSchema.pre("find", autopopulate);
commentSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Comment", commentSchema);
