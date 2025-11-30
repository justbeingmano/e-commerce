import { Product } from "../models/product.model.js";
import { addReviewValidation } from "../validations/product.validation.js";
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
