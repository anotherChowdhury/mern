const express = require("express");
const morgan = require("morgan");
const Mongoose = require("mongoose");
const path = require("path");
const userRoutes = require("./api/routes/user");
require("dotenv").config();

Mongoose.connect(
  process.env.DATABASE_URI,
  {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
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
app.use("/user", userRoutes);
app.use(express.static(path.join(__dirname, "frontend", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

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

app.listen(process.env.PORT || 5000);
