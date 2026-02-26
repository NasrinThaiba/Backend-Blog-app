const jwt = require("jsonwebtoken");
const User = require("../models/User"); 

const admin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);

    if (!user || !user.role || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
    
  } catch (err) {
    console.error("Admin middleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = admin;