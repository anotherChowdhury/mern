const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");

router.post("/add", async (req, res) => {
  try {
    // let totalField =;
    // // console.log(totalField);

    let incrementedObject = {};
    incrementedObject[`total${req.body.reaction}s`] = 1;

    reaction = await Post.findByIdAndUpdate(
      req.postId,
      {
        $push: {
          reactors: { reactor: req.body.userId, reaction: req.body.reaction },
        },
        $inc: incrementedObject,
      },
      { new: true }
    ).populate("reactors.reactor", "name");

    res.status(200).json(reaction);
    req.app.io.sockets.connected[req.body.socketId].broadcast.emit(
      "reactionChanged",
      reaction
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.post("/remove", async (req, res) => {
  try {
    // let totalField =;
    // // console.log(totalField);

    let incrementedObject = {};
    incrementedObject[`total${req.body.reaction}s`] = -1;

    reaction = await Post.findByIdAndUpdate(
      req.postId,
      {
        $pull: {
          reactors: { reactor: req.body.userId },
        },
        $inc: incrementedObject,
      },
      { new: true }
    ).populate("reactors.reactor", "name");

    res.status(200).json(reaction);
    req.app.io.sockets.connected[req.body.socketId].broadcast.emit(
      "reactionChanged",
      reaction
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
