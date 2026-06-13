const mongoose = require("mongoose");

// Tracks which users have shown interest in a product (viewed, wishlisted, carted)
const productInterestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
  },
  interactionType: {
    type: String,
    enum: ["viewed", "wishlisted", "carted"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Compound index for quick lookups
productInterestSchema.index({ productName: 1, interactionType: 1 });
productInterestSchema.index({ userId: 1 });

module.exports = mongoose.model("ProductInterest", productInterestSchema);
