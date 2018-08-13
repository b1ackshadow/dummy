const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    date: {
      type: Date,
      default: new Date()
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        body: String
      }
    ]
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
