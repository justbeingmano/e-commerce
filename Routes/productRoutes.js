import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/auth.middleware.js";
import { Product } from "../models/productModel.js";
import  User  from "../models/userModel.js";


// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // In a real app, you'd verify the JWT token here
    // For now, we'll just check if the token exists
    const user = await User.findOne({}); // This is a placeholder
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findActive();
    res.json({ message: "Products retrieved successfully", data: products });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product retrieved successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error: error.message });
  }
});

// Create new product
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      createdBy: req.user._id
    });

    const savedProduct = await product.save();
    res.status(201).json({ message: "Product created successfully", data: savedProduct });
  } catch (error) {
    res.status(400).json({ message: "Error creating product", error: error.message });
  }
});

// Update product
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, description, price, category, stock, isActive } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user owns the product
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You can only update your own products." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, isActive },
      { new: true, runValidators: true }
    );

    res.json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    res.status(400).json({ message: "Error updating product", error: error.message });
  }
});

// // Delete product (soft delete)
// router.delete("/:id", verifyToken, async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Check if user owns the product
//     if (product.createdBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Access denied. You can only delete your own products." });
//     }

//     await Product.findByIdAndUpdate(req.params.id, { isActive: false });
//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(400).json({ message: "Error deleting product", error: error.message });
//   }
// });

// Patch product (partial update)
router.delete("./", authMiddleware, async (req, res) => {
  // try {
  //   const product = await Product.findById(req.params.id);
  //   if (!product) {
  //     return res.status(404).json({ message: "Product not found" });
  //   }

  //   // Check if user owns the product
  //   if (product.createdBy.toString() !== req.user._id.toString()) {
  //     return res.status(403).json({ message: "Access denied. You can only update your own products." });
  //   }

  //   const updatedProduct = await Product.findByIdAndUpdate(
  //     req.params.id,
  //     { $set: req.body },
  //     { new: true, runValidators: true }
  //   );

  //   res.json({ message: "Product updated successfully", data: updatedProduct });
  // } catch (error) {
  //   res.status(400).json({ message: "Error updating product", error: error.message });
  // }
  // Implement partial update logic if needed. For now return not implemented.
  res.status(501).json({ message: "Not implemented: patch product" });
});

export default router;