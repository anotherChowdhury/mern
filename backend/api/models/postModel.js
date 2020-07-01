const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    _id: mongoose.Types.ObjectId,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      trim: true,
    },
    imageLink: {
      type: String,
      trim: true,
    },
    totalUpvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalDownvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalHearts: {
      type: Number,
      default: 0,
      min: 0,
    },
    reactors: [
      {
        reactor: { ref: "User", type: mongoose.Types.ObjectId },
        reaction: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
