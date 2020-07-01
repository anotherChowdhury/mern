const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

exports.addPost = async (req, res) => {
  let imageLink = "";
  if (req.file) imageLink = "http://localhost:5000/image/" + req.file.filename;

  let post = new Post({
    _id: mongoose.Types.ObjectId(),
    text: req.body.text,
    user: req.userId,
    imageLink: imageLink,
  });

  try {
    let new_post = await post.save();
    post = await Post.findById(new_post._id).populate("user", "name");
    // console.log(post);
    res.status(201).json(post);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: err });
  }
};

exports.getAllPostByUser = (req, res) => {
  Post.find({
    user: req.userId,
  })
    .sort({ createdAt: -1 })
    .populate("user", "name")
    .exec()
    .then((posts) => {
      return res.status(200).json(posts);
    })
    .catch((err) => {
      return res.status(400).json({ error: "error" });
    });
};

exports.deletePost = (req, res) => {
  Post.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  })
    .exec()
    .then((result) => {
      Comment.deleteMany({ post: result._id })
        .exec()
        .then((deleted) => {
          res.status(200).json({ message: "deleted" });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ error: "error" });
    });
};

exports.updatePost = async (req, res) => {
  let post = await Post.findByIdAndUpdate(
    {
      _id: req.params.id,
      user: req.userId,
    },
    { $set: { text: req.body.text } }
  );
  res.status(200).json(post);
};

exports.getAllPostForHome = async (req, res) => {
  let result = await User.findById({ _id: req.userId }).select("friends");
  ids = result.friends;
  ids.push(req.userId);
  let posts = await Post.find({ user: { $in: ids } })
    .sort({ createdAt: -1 })
    .populate("user", "name");
  // console.log(posts);
  res.status(200).json(posts);
};
