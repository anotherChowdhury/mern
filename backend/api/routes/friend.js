const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const checkAuth = require("../middleware/checkAuth");

router.post("/add", checkAuth, async (req, res) => {
  console.log(req.body.sendRequestTo);
  try {
    let requestSender = await User.findByIdAndUpdate(
      { _id: req.userId },
      { $push: { sentRequests: req.body.sendRequestTo } },
      { new: true }
    );

    let requestReceiver = await User.findByIdAndUpdate(
      { _id: req.body.sendRequestTo },
      { $push: { friendRequests: req.userId } },
      { new: true }
    );

    res
      .status(200)
      .json({ requestSender: requestSender, requestReceiver: requestReceiver });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.post("/accept", checkAuth, async (req, res) => {
  try {
    let requestAccepter = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $push: { friends: req.body.acceptRequestOf },
        $pull: { friendRequests: req.body.acceptRequestOf },
      },
      { new: true }
    )
      .populate("freinds", "name")
      .populate("friendRequests", "name");

    let requestSender = await User.findByIdAndUpdate(
      { _id: req.body.acceptRequestOf },
      {
        $push: { friends: req.userId },
        $pull: { sentRequests: req.userId },
      },
      { new: true }
    )
      .populate("freinds", "name")
      .populate("sentRequests", "name");

    res
      .status(200)
      .json({ requestAccepter: requestAccepter, requestSender: requestSender });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.post("/reject", checkAuth, async (req, res) => {
  try {
    let requestRejector = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $pull: { friendRequests: req.body.rejectRequestOf },
      }
    ).populate("friendRequests", "name id");

    let requestSender = await User.findByIdAndUpdate(req.body.rejectRequestOf, {
      $pull: { sentRequests: req.userId },
    }).populate("sentRequests", "name id");

    console.log(requestRejector);
    console.log(requestSender);

    res.status(200).json({
      requestSender: requestSender,
      requestRejector: requestRejector,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/friendrequests", checkAuth, async (req, res) => {
  try {
    user = await User.findById(req.userId)
      .populate("friendRequests", "name id ")
      .exec();

    res.status(200).json({
      requests: user.friendRequests,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/friends", checkAuth, async (req, res) => {
  try {
    user = await User.findById(req.userId).populate("friends", "name id ");
    res.status(200).json({
      requests: user.friends,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/sentrequests", checkAuth, async (req, res) => {
  try {
    user = await User.findById(req.userId).populate("sentRequests", "name id ");

    res.status(200).json({
      requests: user.sentRequests,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.delete("/removerequest", checkAuth, async (req, res) => {
  try {
    let requestSender = await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: { sentRequests: req.body.removeRequestFor },
      },
      { new: true }
    )
      .populate("sentRequests", "name id ")
      .exec();

    let requestReceiver = await User.findByIdAndUpdate(
      req.body.removeRequestFor,
      { $pull: { friendRequests: req.userId } },
      { new: true }
    )
      .populate("friendRequests", "name id ")
      .exec();

    res.status(200).json({
      sentRequestsOfSender: requestSender.sentRequests,
      firendRequestOfRemoved: requestReceiver.friendRequests,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.delete("/removefriend", checkAuth, async (req, res) => {
  try {
    let requestSender = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { friends: req.body.remove } },
      { new: true }
    )
      .populate("friends", "name id ")
      .exec();

    let requestReceiver = await User.findByIdAndUpdate(
      req.body.remove,
      { $pull: { friends: req.userId } },
      { new: true }
    )
      .populate("friends", "name id ")
      .exec();

    res.status(200).json({
      friendsOfRemover: requestSender.friends,
      friendsOfRemoved: requestReceiver.friends,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/suggestions", checkAuth, async (req, res) => {
  try {
    let user = await await User.findById(req.userId);
    let suggestions = "";
    if (user.friends.length !== 0) {
      suggestions = await User.find({
        $and: [
          { _id: { $nin: user.friends } },
          { _id: { $nin: user.friendRequests } },
          { _id: { $nin: user.sentRequests } },
        ],
      })
        .select("name")
        .limit(20);
    } else {
      suggestions = await User.find({
        $and: [
          { _id: { $ne: user._id } },
          { _id: { $nin: user.friendRequests } },
          { _id: { $nin: user.sentRequests } },
        ],
      })
        .select("name")
        .limit(20);
    }
    res.status(200).json({ suggestions: suggestions });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: err });
  }
});

module.exports = router;
