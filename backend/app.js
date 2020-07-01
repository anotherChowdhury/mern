const express = require("express");
const morgan = require("morgan");
const Mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const userRoutes = require("./api/routes/user");
const postRoutes = require("./api/routes/post");
require("dotenv").config();

Mongoose.connect(
  process.env.DATABASE_URI,
  {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) throw err;
    console.log("Connection Successfull");
  }
);

app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Accept, Authorization, Content-Type"
  );
  res.header("Access-Control-Allow-Methods", "OPTIONS,GET, PUT, POST, DELETE");
  // if (req.methods == "OPTIONS") {
  //   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  //   return res.status(200).json({});
  // }
  next();
});
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/image", express.static("uploads"));
// app.use(express.static(path.join(__dirname, "frontend", "build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
// });

// app.use(express.static(path.join(__dirname, "frontend", "public")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "public", "index.html"));
// });

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
