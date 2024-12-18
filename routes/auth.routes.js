var express = require("express");
var router = express.Router();
const { userLogin } = require("../controllers/auth.controller");

/* GET home page. */
router.post("/login", userLogin);

module.exports = router;
