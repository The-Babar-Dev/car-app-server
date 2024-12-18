require("dotenv").config();
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const Car = require("../models/carModel");

exports.getCars = asyncErrorHandler(async (req, res, next) => {
  const cars = await Car.find().populate("User", "name");

  res.status(200).json({
    success: true,
    data: {
      cars,
    },
  });
});

exports.getCar = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Car ID is required.",
    });
  }

  const car = await Car.findById(id);

  res.status(200).json({
    success: true,
    data: {
      car,
    },
  });
});

exports.addCar = asyncErrorHandler(async (req, res, next) => {
  const carData = req.body;

  const { CarModel, Price, PhoneNumber, Pictures } = carData;

  // Validate that the car data is not empty
  if (
    Object.keys(carData).length === 0 ||
    !CarModel ||
    !Price ||
    !PhoneNumber
    // !Pictures ||
    // Pictures?.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide complete data to save.",
    });
  }

  const existingCar = await Car.findOne({ CarModel });

  if (existingCar) {
    return res.status(400).json({
      success: false,
      message: "Car Model already exists.",
    });
  }

  const newCar = new Car({ ...req.body, User: req.userId });

  await newCar.save();

  res.status(200).json({
    success: true,
    message: "Car saved successfully!",
  });
});

exports.updateCar = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Car ID is required.",
    });
  }

  // Validate that the update data is not empty
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No update data provided.",
    });
  }

  const car = await Car.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  // If no car is found, return a 404 response
  if (!car) {
    return res.status(404).json({
      success: false,
      message: "Car not found.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Car updated successfully!",
  });
});

exports.deleteCar = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Car ID is required.",
    });
  }

  let deletedCar = await Car.findByIdAndDelete(id);

  if (!deletedCar) {
    return res.status(404).json({
      success: false,
      message: `Car with id ${req.params.id} not found`,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Car deleted successfully!",
  });
});
