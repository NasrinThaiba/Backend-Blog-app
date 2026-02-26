const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

router.post("/become-admin", auth, async (req, res) => {
  const { passkey } = req.body;

  if (passkey !== process.env.ADMIN_PASSKEY) {
    return res.status(403).json({ message: "Invalid admin passkey" });
  }

  try {
    const user = await User.findById(req.user.id);
    user.role = "admin";
    await user.save();

    res.status(200).json({ message: "Role updated to admin" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;