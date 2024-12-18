require("dotenv").config();
const jwt = require("jsonwebtoken");

const checkSessionAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      //check token is valid or not
      const isValidToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!isValidToken) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      console.log("isValidToken");
      console.log(isValidToken);
      //Add token data in req so that we can access token data in api handler
      req.userId = isValidToken?.userId;

      next();
    } catch {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = { checkSessionAuth };
