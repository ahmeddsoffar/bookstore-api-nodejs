const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const router = express.Router();

// two layer protection
router.get("/welcome", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    message: "Admin page",
  });
});

module.exports = router;
