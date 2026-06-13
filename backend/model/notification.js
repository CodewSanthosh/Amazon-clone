const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["return_nearby", "price_drop", "back_in_stock", "green_credit"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
  },
  productImage: {
    type: String,
  },
  returnId: {
    type: String,
  },
  refurbishedProductId: {
    type: String,
  },
  discount: {
    type: Number,
  },
  originalPrice: {
    type: Number,
  },
  offerPrice: {
    type: Number,
  },
  read: {
    type: Boolean,
    default: false,
  },
  actionUrl: {
    type: String,
  },
  expiresAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
