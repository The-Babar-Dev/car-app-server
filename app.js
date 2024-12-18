var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var dotenv = require("dotenv");
var connectDb = require("./db/connectDb");

const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/error.controller");
const authRouter = require("./routes/auth.routes");
const carRouter = require("./routes/car.routes");

dotenv.config();

var app = express();

//Middlewares
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//App routes
app.use("/api/auth", authRouter);
app.use("/api/cars", carRouter);

//Base route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

//Default router handler
app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server!`,
    404
  );
  next(err);
});

//Global Error handler
app.use(globalErrorHandler);

//Db connection

app.listen(3001, () => {
  connectDb(); //Make Db Connection
  console.log("Express Server Running on port 3001");
});

module.exports = app;
