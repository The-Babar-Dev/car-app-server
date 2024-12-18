const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  CarModel: {
    type: String,
    required: [true, "Car Model is required!"],
    unique: true,
  },
  Price: {
    type: Number,
    required: [true, "Price is required!"],
  },
  PhoneNumber: {
    type: String,
    required: [true, "Phone Number is required!"],
  },
  Pictures: {
    type: [String],
    // required: [true, "Pictures required!"], // @TODO
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
