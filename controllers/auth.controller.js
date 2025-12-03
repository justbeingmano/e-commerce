import { generateToken } from "../models/userModel.js";
import  User  from "../models/userModel.js";
import {
  validationR,
  validationLogin,
} from "../validations/userValidations.js";
const registerVaildation = validationR;
const loginVaildation = validationLogin;

//Register
export const  createUser = async (req, res) => {
  try {
    const { error, value } = registerVaildation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const userExist = await User.findOne({ email: value.email });
    if (userExist) {
      return res.status(400).json({ message: "user already exists" });
    }

    const user = await User.create({
      ...value,
      role: value.role || "user"
    });
    const token = generateToken(user);

    return res.status(201).json({ message: "user created...", data: { user } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Login
export const login = async (req,res) =>{
    try {

    const { error, value } = loginVaildation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }


    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email " });
    }


    const isMatch = await user.matchPassword(value.password);
    console.log('DEBUG login entered password:', value.password);
    console.log('DEBUG stored hashed password:', user.password);
    console.log('DEBUG bcrypt compare result (isMatch):', isMatch);

    if (!isMatch) {
      console.log(`${value.password}`);
      return res.status(400).json({ message: "Invalid  password" });
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
};