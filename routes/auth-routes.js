const express = require("express");
const { register, login } = require("../controller/auth-controller");
const router = express.Router();

//rotes for authintcaion and authorization
router.post("/register", register);
router.post("/login", login);

module.exports = router;
