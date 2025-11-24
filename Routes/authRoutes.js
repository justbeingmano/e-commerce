import express from "express";
const router = express.Router();
import { generateToken } from "../models/userModel.js";
import  User  from "../models/userModel.js";
import {
  validationR,
  validationLogin,
} from "../validations/userValidations.js";

const registerVaildation = validationR;
const loginVaildation = validationLogin;
//register
router.post("/register", async (req, res) => {
  try {
    const { error, value } = registerVaildation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const userExist = await User.findOne({ email: value.email });
    if (userExist) {
      return res.status(400).json({ message: "user already exists" });
    }

    const user = await User.create(value);
    const token = generateToken(user);

    return res.status(201).json({ message: "user created...", data: { token } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// LOGIN
router.post("/login", async (req, res) => {
  try {

    const { error, value } = loginVaildation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }


    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }


    const isMatch = await user.matchPassword(value.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }


    const token = generateToken(user);


    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;