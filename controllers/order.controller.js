import { Order } from "../models/orderModel.js"
import { Product } from "../models/productModel.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item" });
    }

    let totalPrice = 0;

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      totalPrice += product.price * item.quantity;
    }

    const order = await Order.create({
      user: userId,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    return res.status(201).json({ message: "Order created successfully", order });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
    }else{
    return res.status(200).json({ orders });
    }

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

