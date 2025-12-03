import { Product } from "../models/productModel.js";
import { ReviewV , createProductValidation} from "../validations/productValidations.js";
import { paginate } from "../utils/paginate.js";

export const updateProduct = async (req,res) =>{
    try{
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
      res.json({ message: "Product updated successfully", 
        data: updatedProduct 
      });
    }catch(error) {
      res.status(400).json({ message: "Error updating product", error: error.message });
    }
}


export const addReview = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id; 

    const { error } = ReviewV.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      (rev) => rev.user.toString() === userId.toString()
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      product.reviews.push({
        user: userId,
        rating,
        comment,
      });
    }

    // Recalculate average rating
    product.totalReviews = product.reviews.length;

    product.averageRating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(200).json({
      message: "Review added successfully",
      data: product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProduct = async (req, res) => {
  // Validate request body first
  const { error } = createProductValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { name, description, price, category, stock, isActive } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedProduct = await product.save();
    res.status(201).json({ message: "Product created successfully", data: savedProduct });
  } catch (error) {
    res.status(400).json({ message: "Error creating product", error: error.message });
  }
};

  export const deleteProduct = async (req,res)=>{
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
  };


  export const getAllProduct = async (req, res) => {
  try {
    const result = await paginate(Product, {}, req.query);
    res.json({
      message: "Products retrieved successfully",
      ...result,
    });
  }catch (error) {
    res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
}

export const filter = async (req, res) => {
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
    // use paginate helper
    const result = await paginate(Product , filter , {
      ...req.query,
      sort:sortOption,
    });
    res.json({
      message: "Product retrieved successfully",
      ...result,
    });
  }catch (error) {
    res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
}

export const getProductById =async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(201).json({ message: "Product retrieved successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: "Error ya 8ali", error: error.message });
  }
}