import { Order } from "../models/orderModel.js"
import { Product } from "../models/productModel.js";


const checkStockAvailability = async (items) => {
  for (let item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      return {
        ok: false,
        message: `Product not found with ID: ${item.product}`,
      };
    }

    if (product.stock < item.quantity) {
      return {
        ok: false,
        message: `Not enough stock for product: ${product.name}. Available: ${product.stock}`,
      };
    }
  }

  return { ok: true };
};


const reduceProductStock = async (items) => {
  for (let item of items) {
    const product = await Product.findById(item.product);

    product.stock -= item.quantity;
    await product.save();
  }
};


export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const stockCheck = await checkStockAvailability(items);

    if (!stockCheck) {
      return res.status(400).json({ message: "SOLD OUT ITEM"});
    }

    await reduceProductStock(items);

    let totalPrice = 0;

    for (let item of items) {
      const product = await Product.findById(item.product);
      totalPrice = product.price * item.quantity;
    }

    const order = new Order({
      user: userId,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    await order.save();

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
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

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("items.product", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ order });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed to cancel this order" });
    }

    if (order.orderStatus !== "Pending") {
      return res.status(400).json({ message: "Order cannot be cancelled anymore" });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    return res.json({ message: "Order cancelled successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "NO ORDERS YA BOSS" });
    }else
    return res.status(200).json({ orders });

  } catch (error) {
    next(error);
  }
};
