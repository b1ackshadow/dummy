const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  body: String,
  date: {
    type: Date,
    default: new Date()
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
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
});

function autopopulate(next) {
  this.populate("author");

  next();
}
replySchema.pre("find", autopopulate);
replySchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Reply", replySchema);
