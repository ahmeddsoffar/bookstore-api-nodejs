const authMiddleware = require("../middleware/auth-middleware");

const express = require("express");
const {
  register,
  login,
  changePassword,
  changeUsername,
} = require("../controller/auth-controller");
const router = express.Router();

//rotes for authintcaion and authorization
router.post("/register", register);
router.post("/login", login);
router.post("/change-password", authMiddleware, changePassword);
router.post("/change-username", authMiddleware, changeUsername);

module.exports = router;
