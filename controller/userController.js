const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secure = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("Please Enter Valid Token");
    }
    let tokenData = jwt.verify(token, "SECRET");
    let checkUser = await User.findById(tokenData.id);
    if (!checkUser) {
      throw new Error("User not Found");
    }
    req.user = checkUser;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const register = async (req, res) => {
  try {
    console.log("Register req.body:", req.body);
    console.log("Register req.file:", req.file);
    const signUpData = req.body;
    signUpData.image = req.file.filename;
    if (
      !signUpData.name ||
      !signUpData.email ||
      !signUpData.password ||
      !signUpData.image
    ) {
      throw new Error("Please Enter All Fields");
    }
    signUpData.password = await bcrypt.hash(signUpData.password, 10);
    const createSignup = await User.create(signUpData);
    const token = jwt.sign({ id: createSignup._id }, "SECRET");
    res.status(201).json({ message: "You are Signup", createSignup, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const loginData = req.body;
    if (!loginData.email || !loginData.password) {
      throw new Error("Please Enter Email and Password");
    }
    const checkUser = await User.findOne({ email: loginData.email }).select(
      "address password"
    );
    if (!checkUser) {
      throw new Error("User not Found");
    }
    const checkPassword = await bcrypt.compare(
      loginData.password,
      checkUser.password
    );
    const token = jwt.sign({ id: checkUser._id }, "SECRET");
    res
      .status(200)
      .json({ message: "User Login Successful", token, checkUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { secure, register, login };
