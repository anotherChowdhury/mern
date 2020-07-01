const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const upload = require("../middleware/upload");
const Comment = require("../models/commentModel");
const mongoose = require("mongoose");

const comment = express.Router();

comment.post(
  "/add",
  checkAuth,
  upload.single("commentImage"),
  async (req, res) => {
    // console.log(req.userId);
    // console.log(req.postId);
    // console.log(req.file);

    let imageLink = "";
    if (req.file)
      imageLink = "http://localhost:5000/image/" + req.file.filename;
    let new_comment = new Comment({
      _id: mongoose.Types.ObjectId(),
      user: req.userId,
      post: req.postId,
      comment: req.body.text,
      imageLink: imageLink,
    });

    try {
      let comment = await new_comment.save();
      comment = await Comment.findById(comment._id).populate("user", "name");
      req.app.io.sockets.connected[req.body.socketId].broadcast.emit(
        "newComment",
        comment
      );
      return res.status(201).json({ comment });
    } catch (err) {
      console.log(err);

      res.status(500).send(err);
    }
  }
);

comment.get("/", async (req, res) => {
  try {
    let comments = await Comment.find({
      post: req.postId,
    })
      .select("_id createdAt comment imageLink")
      .populate("user", "name");

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

comment.delete("/:commentId", async (req, res) => {
  // console.log(req.params.commentId);

  try {
    let comment = await Comment.findOneAndDelete({ _id: req.params.commentId });

    console.log(req.body);
    req.app.io.sockets.connected[
      req.body.socketId
    ].broadcast.emit("deletedComment", { cid: comment._id, pid: comment.post });
    res.status(200).json({ message: "deleted" });
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

comment.put("/:commentId", async (req, res) => {
  // console.log(req.body);

  try {
    let comment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId },
      { $set: { comment: req.body.updatedComment } }
    );

    // console.log(comment);
    req.app.io.sockets.connected[req.body.socketId].broadcast.emit(
      "updatedComment",
      comment
    );
    res.status(200).json({ message: "updated" });
    req.app.io.sockets.emit("updatedComment", comment);
  } catch (err) {
    console.log(error);
    res.status(500).json(err);
  }
});
module.exports = comment;
