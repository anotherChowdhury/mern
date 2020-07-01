const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /\S+@\S+/,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
    default: "",
  },
  resetTokenValidity: {
    type: String,
    default: "",
  },
  friends: [this],
  friendRequests: [this],
  sentRequests: [this],
});

module.exports = mongoose.model("User", userSchema);
