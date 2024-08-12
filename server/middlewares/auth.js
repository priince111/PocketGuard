const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log("header",req.headers)
  if (!authorization) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authorization.split(" ")[1]; 
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id).select("-password"); // Attach user to request object
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
