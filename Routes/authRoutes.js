import express from "express";
import { createUser, login } from "../controllers/auth.controller.js";

const router = express.Router();


//register
router.post("/register", createUser);
// LOGIN
router.post("/login", login);
export default router;