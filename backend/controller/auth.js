const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const AuthHelper = require("../helper/AuthHelper");

const AuthController = module.exports;

AuthController.signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password:hashedPassword,
      role,
    });
    await newUser.save();
    return res.status(201).json({
      success:true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ success:false, message: "Error registering user", error });
  }
};

AuthController.SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Something is missing", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success:false,message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success:false,message: "Invalid credentials" });
    }
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
    const userToken = AuthHelper.createJWTToken(payload);

    res.status(200).json({
      success:true,
      message: "User Login Successfully",
      userToken,
      role: user.role,
      user,
    });
  } catch (error) {
    res.status(500).json({ success:false,message: "Error logging in", error });
  }
};
