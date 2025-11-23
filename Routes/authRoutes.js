import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import  User  from "../models/userModel.js";
import {
  validationR,
  validationLogin,
} from "../validations/userValidations.js";

const registerVaildation = validationR;
const loginVaildation = validationLogin;
router.post("/register", async (req, res) => {
  try {
    const { error, value } = registerVaildation.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    }
    const userExist = await User.findByEmail(value.email);
    if (userExist) {
      res.status(404).json({ message: "user not founded" });
    }

    const user = await User.create(value);

    const token = user.generateToken();
    res.status(201).json({ message: "user created...", data: { token } });
  } catch (error) {}
});
// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginVaildation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });


    const user = await User.findOne({ email: value.email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(value.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

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
    res.status(500).json({ message: error.message });
  }
});//generateToken
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
export default router;