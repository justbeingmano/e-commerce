import express from "express";
const router = express.Router();
import { authMiddleware } from "../Middlewares/authMiddleware.js";
import { authorizeRoles } from "../Middlewares/roleMiddleware.js";
import { Product } from "../models/productModel.js";
// import  addReview  from "../controllers/product.controller.js";
// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ message: "Products retrieved successfully", data: products });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
});
// Get all products with filters
router.get("/filter", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, minRate, maxRate, sort } = req.query;
    let filter = { isActive: true };

    //search by name or discription
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    //category fitler
    if (category) {
      filter.category = category;
    }

    //price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    //rating filter
    if (minRate || maxRate) {
      filter.averageRating = {};
      if (minRate) filter.averageRating.$gte = Number(minRate);
      if (maxRate) filter.averageRating.$lte = Number(maxRate);
    }

    //sorting option
    let sortOption = {};
    if (sort === "priceAsc") sortOption.price = 1;
    if (sort === "priceDesc") sortOption.price = -1;
    if (sort === "ratingDesc") sortOption.averageRating = -1;
    if (sort === "ratingAsc") sortOption.averageRating = 1;
    if (sort === "newest") sortOption.createdAt = -1;
    const products = await Product.find(filter).sort(sortOption);

    res.json({
      message: "Products reatrived successfully",
      count: products.length,
      data: products,
    });


  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
});

// Create new product
router.post("/create", authMiddleware, authorizeRoles("admin"), async (req, res) => {
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
router.put("/:id", authMiddleware, authorizeRoles("admin", "user"),
  async (req, res) => {
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
router.delete("/:id", authMiddleware, authorizeRoles(["admin"]), async (req, res) => {
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

//add review
// router.post("/:id/review", authorizeRoles("user"), addReview);
export default router;