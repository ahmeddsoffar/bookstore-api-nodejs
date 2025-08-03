const adminMiddleware = (req, res, next) => {
  if (req.userInfo.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "access denied not admin" });
  }
  next();
};

module.exports = adminMiddleware;
