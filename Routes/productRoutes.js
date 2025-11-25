import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/auth.middleware.js";
import { Product } from "../models/productModel.js";



// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
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
    res.status(201).json({ message: "Product retrieved successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: "Error ya 8ali", error: error.message });
  }
});
// Create new product
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
    });

    const savedProduct = await product.save();
    res.status(201).json({ message: "Product created successfully", data: savedProduct });
  } catch (error) {
    res.status(400).json({ message: "Error creating product", error: error.message });
  }
});

// Update product
router.put("/:id",  async (req, res) => {
  try {
    const { name, description, price, category, stock, isActive } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
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

// Delete product (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting product", error: error.message });
  }
});



export default router;