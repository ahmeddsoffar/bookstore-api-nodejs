const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("authMiddleware called ");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "access denied no login tokens" });
  }
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);
    req.userInfo = decoded; // decoded is the user information for exaple using it at the user profile page
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "access denied invalid token" });
  }
  //next();
};

module.exports = authMiddleware;
