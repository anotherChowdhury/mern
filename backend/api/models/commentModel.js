const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    _id: mongoose.Types.ObjectId,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: String,
    },
    imageLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
