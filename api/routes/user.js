const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

const userController = require("../controller/user");

router.post("/signup", userController.user_registration);

router.post("/signin", userController.userSignin);

router.post("/forget", userController.forget);

router.get("/resetpassword", userController.reset);

router.post("/updatepassword", userController.updatepass);

router.get("/name", checkAuth, userController.getName);

module.exports = router;
