const CustomError = require("../utils/CustomError");

//In dev, we want as much information about error as possible
const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const prodErrors = (res, error) => {
  //In prod, we want to send only those errors to the client which is an operational error due to security reasons
  if (error.isOperational) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
  //for other errors
  else {
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again later!",
    });
  }
};

const duplicateKeyErrorHandler = (err) => {
  const msg = `There is already a Car with Model ${err.keyValue.CarModel}. Please use another Model!`;
  return new CustomError(msg, 400);
};

//Global error handler function
module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    //Duplicate key error i.e creating car with same model etc
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);

    prodErrors(res, error);
  }
};
