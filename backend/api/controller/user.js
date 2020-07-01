const jwt = require("jsonwebtoken");
const mail = require("nodemailer");
const cryprto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Mongoose = require("mongoose");
require("dotenv").config();

exports.user_registration = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .exec()
    .then((result) => {
      if (result) {
        res.status(409).json({
          message: "Email Exists",
        });
      } else {
        bcrypt.hash(req.body.password, 16, (err, hash) => {
          if (err) {
            res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new Mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                // console.log(result);
                res.status(201).json({
                  message: "User Created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.userSignin = (req, res) => {
  console.log(req.body);
  User.findOne({
    email: req.body.email,
  })
    .exec()
    .then((user) => {
      // console.log(user);
      if (!user) {
        return res.status(401).json({
          message: "AUth Failed",
        });
      } else {
        // console.log(user.password);
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "AUth Failed",
            });
          }

          if (result) {
            // console.log(result);
            const token = jwt.sign(
              {
                _id: user._id,
              },
              process.env.SECRET,
              {
                expiresIn: "3h",
              }
            );

            return res.status(200).json({
              token: token,
            });
          }

          res.status(401).json({
            message: "AUth Failed",
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.forget = async (req, res) => {
  let user = await User.findOne({
    email: req.body.email,
  });
  if (!user)
    return res.status(400).json({
      message: "No user Found",
    });

  const forgetpasstoken = cryprto.randomBytes(30).toString("hex");
  user.resetToken = forgetpasstoken;
  user.resetTokenValidity = Date.now() + 360000;

  user.save().catch((err) => {
    res.status(500).json({
      message: "Error occured",
    });
  });

  let transporter = mail.createTransport({
    service: "gmail",
    // port: 587,
    // secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  console.log("Trying to sendmail");

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Reset Password",
      html: `
                <h2 style="padding:0 0 20px 0;"> Request for password reset has been sent from this emai. If you didn't sent this request, just ignore this <h2>
                <h2 style="padding:0 0 20px 0;">Please Click the link below to reset your password</h2>
                <a href="https://ajairaaapp.herokuapp.com/resetpassword/${forgetpasstoken}">Reset Password</a>
                <h2 style="padding:20 0 20px 0; color:red;">This will expire in 1 hour</h2>
                `,
    });
    return res.status(200).json({
      message: "mail sent",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err,
    });
  }
};

exports.reset = async (req, res) => {
  console.log(req.headers.authorization);
  let user = await User.findOne({
    resetToken: req.headers.authorization,
    resetTokenValidity: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "No user Found",
    });
  }

  return res.status(200).json({
    message: "okay",
    token: user.resetToken,
  });
};

exports.updatepass = async (req, res) => {
  let user = await User.findOne({
    resetToken: req.headers.authorization,
    resetTokenValidity: {
      $gt: Date.now(),
    },
  });

  if (!user)
    return res.status(400).json({
      message: "No user Found",
    });

  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      res.status(500).json({
        message: err,
      });
    } else {
      user.password = hash;
      await user.save().catch((err) => console.log(err));
      res.status(200).json({
        message: "password updated",
      });
    }
  });
};

exports.getName = async (req, res) => {
  user = await User.findById(req.userId);
  res.status(200).json({
    name: user.name,
    id: user._id,
  });
};

exports.getId = (req, res) => {
  res.status(200).json({ id: req.userid });
};
