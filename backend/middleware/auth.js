const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to get user from JWT
async function getUserFromToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { getUserFromToken };
