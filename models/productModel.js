import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    image: { type: String },

    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    reviews: [reviewSchema],

    
  },
  { timestamps: true }
);

export{productSchema,reviewSchema};

export const Product = mongoose.model("Product", productSchema);
