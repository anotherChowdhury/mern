const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  // console.log(token);
  try {
    decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded);
    req.userData = decoded;
    next();
  } catch (err) {
    console.log(err);

    return res.status(401).json({
      message: "Login Required",
    });
  }
};
