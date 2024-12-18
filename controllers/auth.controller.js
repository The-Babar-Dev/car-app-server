require("dotenv").config();
const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const User = require("../models/userModel");

exports.userLogin = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email & password present in req.body
  if (!email || !password) {
    const error = new CustomError(
      "Please provide email Id & password for login!",
      400
    );
    return next(error);
  }

  //Check if user exist with provided email
  const user = await User.findOne({ email });

  if (!user) {
    const error = new CustomError("Incorrect email or password!", 400);
    return next(error);
  }

  // Compare the provided password with the stored password (plain text comparison)
  if (user.password !== password) {
    const error = new CustomError("Incorrect email or password!", 400);
    return next(error);
  }

  const sessionToken = signToken(user._id);

  res.status(200).json({
    success: true,
    username: user.name,
    sessionToken,
  });
});

const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};
