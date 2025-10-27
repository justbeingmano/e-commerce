const router = require("express").Router();
const mongoose = require("mongoose");
const Joi = require("joi");
const { User } = require("../models/userModel");
const {
  validationR,
  validationLogin,
} = require("../validations/userValidations");

// map validation names to the ones the routes expect
const registerVaildation = validationR;
const loginVaildation = validationLogin;
router.post("/register", async (req, res) => {
  try {
    const { error, value } = registerVaildation.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    }

    // User => Email
    const userExist = await User.findByEmail(value.email);
    if (userExist) {
      res.status(400).json({ message: "invalid data" });
    }

    const user = await User.create(value);

    // Generate Token
    const token = user.generateToken();
    res.status(201).json({ message: "user created...", data: { token } });
  } catch (error) {}
});

router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginVaildation.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const userExist = await User.findByEmail(value.email);
    if (!userExist) {
      res.status(400).json({ message: "invalid credentials" });
    }

    const isValid = await userExist.comparePassword(value.password);
    if (!isValid) {
      res.status(400).json({ message: "invalid credentials" });
    }

    const token = userExist.generateToken();
    res.json({ message: "user logged", data: { token } });
  } catch (error) {}
});

module.exports = router;