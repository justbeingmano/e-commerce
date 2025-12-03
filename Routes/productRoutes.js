import express from "express";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
import { authorizeRoles } from "../Middlewares/roleMiddleware.js";
import {addReview,  createProduct ,deleteProduct,getAllProduct,updateProduct ,filter, getProductById } from "../controllers/product.controller.js";
const router = express.Router();
// Get all products
router.get("/", getAllProduct);
// Get all products with filters
router.get("/filter", filter);
// Create new product
router.post("/create", authMiddleware, authorizeRoles("admin"), createProduct);
// Update product
router.put("/:id", authMiddleware, authorizeRoles("admin", "user"), updateProduct);
// Delete product (soft delete)
router.delete("/:id", authMiddleware, authorizeRoles(["admin"]), deleteProduct);
 // Get product by ID
router.get("/:id", getProductById);
//add review
router.post("/:id/review", authMiddleware, authorizeRoles("user"), addReview);
export default router;