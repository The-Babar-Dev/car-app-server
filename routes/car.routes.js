var express = require("express");
var { checkSessionAuth } = require("../middleware/authMiddleware");
var router = express.Router();
const {
  getCars,
  getCar,
  addCar,
  updateCar,
  deleteCar,
} = require("../controllers/car.controller");

/* GET home page. */
router.get("/", checkSessionAuth, getCars);
router.get("/:id", checkSessionAuth, getCar);
router.post("/", checkSessionAuth, addCar);
router.put("/:id", checkSessionAuth, updateCar);
router.delete("/:id", checkSessionAuth, deleteCar);

module.exports = router;
