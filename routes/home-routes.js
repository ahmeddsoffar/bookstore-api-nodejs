const express = require("express");
const authMiddleware = require("../middleware/auth-middleware"); // da handler byt4mlo be kza step wra ba3d lw kolhm tmam 7yro7 el welcome page
const router = express.Router();

router.get("/welcome", authMiddleware, (req, res) => {
  const { username, userId, role } = req.userInfo;
  res.json({
    message: `Welcome to the home page ${username}`,
    user: {
      username: username,
      _id: userId,
      role: role,
    },
  });
});

module.exports = router;
