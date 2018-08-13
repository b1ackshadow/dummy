const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    body: String,
    title: String,
    date: {
      type: Date,
      default: Date.now
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    hearts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    photo: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post"
});
function autopopulate(next) {
  this.populate("comments");
  this.populate("author");

  next();
}
postSchema.pre("find", autopopulate);
postSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Post", postSchema);
