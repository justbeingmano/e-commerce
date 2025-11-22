import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true,
    trim: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  category: { 
    type: String, 
    required: true,
    trim: true 
  },
  image: { 
    type: String,
    default: null 
  },
  stock: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
}, { timestamps: true });

// Static method to find products by user
productSchema.statics.findByUser = function(userId) {
  return this.find({ createdBy: userId, isActive: true });
};

// Static method to find active products
productSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

const Product = mongoose.model('Product', productSchema);
export { Product };
