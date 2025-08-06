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
    const salt = await bcrypt.genSalt(10); // 10 is the number of string added to the password before hashing for enhancing security
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

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    //extract old password and new password from request body
    const { oldPassword, newPassword } = req.body;
    // finding user by id
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    //check if old password is correct
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid old password" });
    }

    //hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const changeUsername = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { newUsername } = req.body;

    if (!newUsername || newUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters long",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.username === newUsername) {
      return res.status(400).json({
        success: false,
        message: "New username must be different from current username",
      });
    }
    //checking if new username is already taken
    const checkExistingUser = await User.findOne({
      username: newUsername,
      _id: { $ne: userId }, // exclude current user
    });
    if (checkExistingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    user.username = newUsername;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Username changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { register, login, changePassword, changeUsername };
