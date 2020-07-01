const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();
const PostController = require("../controller/post");
const upload = require("../middleware/upload");
const commentRoute = require("./comment");
const reactionRoute = require("./reaction");

router.post("/add", checkAuth, upload.single("image"), PostController.addPost);

router.get("/", checkAuth, PostController.getAllPostByUser);

router.delete("/:id", checkAuth, PostController.deletePost);

router.put("/:id", checkAuth, PostController.updatePost);

router.get("/home", checkAuth, PostController.getAllPostForHome);

router.use(
  "/:postId/comment",
  (req, res, next) => {
    req.postId = req.params.postId;
    next();
  },
  commentRoute
);

router.use(
  "/:postId/reaction",
  (req, res, next) => {
    req.postId = req.params.postId;
    next();
  },
  reactionRoute
);

module.exports = router;
