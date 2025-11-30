import Joi from "joi";

// OrderItem Validation
const OrderItemV = Joi.object({
  product: Joi.string().required(),       
  quantity: Joi.number().min(1).required(),
  price: Joi.number().min(0).required()
});

// Shipping Address Validation
const ShippingAddressV = Joi.object({
  fullName: Joi.string().trim().required(),
  phone: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
  postalCode: Joi.string().trim().required(),
  country: Joi.string().trim().required()
});

// Main Order Validation
const createOrderValidation = Joi.object({
  items: Joi.array().items(OrderItemV).min(1).required(),

  shippingAddress: ShippingAddressV.required(),

  paymentMethod: Joi.string()
    .valid("Cash", "Credit Card")
    .required(),

  paymentStatus: Joi.string()
    .valid("Pending", "Paid", "Failed")
    .default("Pending"),

  orderStatus: Joi.string()
    .valid("Pending", "Processing", "Shipped", "Delivered", "Cancelled")
    .default("Pending"),

  totalPrice: Joi.number().min(0).required()
});

export { createOrderValidation, OrderItemV, ShippingAddressV };