const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const userController = require("../controller/user");
const FriendRouter = require("./friend");

router.post("/signup", userController.user_registration);

router.post("/signin", userController.userSignin);

router.post("/forget", userController.forget);

router.get("/id", checkAuth, userController.getId);

router.get("/resetpassword", userController.reset);

router.post("/updatepassword", userController.updatepass);

router.get("/name", checkAuth, userController.getName);

router.use("/friend", FriendRouter);

module.exports = router;
