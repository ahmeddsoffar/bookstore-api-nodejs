const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register end point
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this username or email",
      });
    }
    //hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//login end point
const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //generate jwt token
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    // Login successful
    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { register, login };
