import express from "express";

import {  getMyOrders,createOrder,getAllOrders} from "../controllers/order.controller.js";

import { authMiddleware } from "../Middlewares/authMiddleware.js";
import { authorizeRoles } from "../Middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("user"), createOrder);
router.get("/my", authMiddleware, authorizeRoles("user"), getMyOrders);
router.get("/", authMiddleware, authorizeRoles("admin"), getAllOrders);


export default router;
