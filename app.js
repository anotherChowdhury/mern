const express = require("express");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const User = require("./models/userModel");
const Mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const mail = require("nodemailer");
const secret = "secretKeyUseEnviormentVariables";
const cryprto = require("crypto");
const path = require("path");

checkAuth = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  try {
    decoded = jwt.verify(token, secret);
    console.log(decoded);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Login Required",
    });
  }
};

Mongoose.connect(
  "mongodb+srv://instagramDBA:opensesame@cluster0-aup8h.mongodb.net/<dbname>?retryWrites=true&w=majority",
  {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Accept, Authorization, Content-Type"
  );
  if (req.methods == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH");
    return res.status(200).json({});
  }
  next();
});
app.use(express.static(path.join(__dirname, "./frontend/build")));

app.post("/signup", (req, res, next) => {
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
        bcrypt.hash(req.body.password, 10, (err, hash) => {
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
                console.log(result);
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
});

app.post("/signin", (req, res, next) => {
  console.log(req.body);
  User.findOne({
    email: req.body.email,
  })
    .exec()
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(401).json({
          message: "AUth Failed",
        });
      } else {
        console.log(user.password);
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "AUth Failed",
            });
          }

          if (result) {
            console.log(result);
            const token = jwt.sign(
              {
                _id: user._id,
              },
              secret,
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
});

app.post("/forget", async (req, res, next) => {
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
      user: "testemailumar@gmail.com",
      pass: "openses@18E",
    },
  });

  console.log("Trying to sendmail");

  try {
    await transporter.sendMail({
      from: "testemailumar@gmail.com",
      to: user.email,
      subject: "Reset Password",
      html: `
            <h2 style="padding:0 0 20px 0;"> Request for password reset has been sent from this emai. If you didn't sent this request, just ignore this <h2>
            <h2 style="padding:0 0 20px 0;">Please Click the link below to reset your password</h2>
            <a href="http://localhost:3000/resetpassword/${forgetpasstoken}">Reset Password</a>
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
});

app.get("/resetpassword", async (req, res, next) => {
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
});

app.post("/updatepassword", async (req, res, next) => {
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
});

app.get("/name", checkAuth, async (req, res, next) => {
  user = await User.findById(req.userData._id);
  res.status(200).json({
    message: user.name,
  });
});
app.use(express.static(path.join(__dirname, "frontend", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.listen(process.env.PORT || 5000);
