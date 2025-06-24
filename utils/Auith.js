const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const JWT_KEY = process.env.JWT_KEY;
const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  console.log("ratta",token)

  if (!token) {
    return res.status(401).json({
      data: { status: false, msg: "Unauthorized - No token" },
    });
  }

  token = token.split(" ")[1];

  jwt.verify(token, JWT_KEY, (err, valid) => {
    if (err) {
      return res.status(401).json({
        data: { status: false, msg: "Unauthorized - Invalid Token" },
      });
    } else {
      req.user = valid;
      next();
    }
  });
};


module.exports = { verifyToken };