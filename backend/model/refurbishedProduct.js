const mongoose = require("mongoose");

const refurbishedProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  refurbPrice: {
    type: Number,
    required: true,
  },
  conditionScore: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  trustScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  defects: [
    {
      type: {
        type: String,
      },
      severity: {
        type: String,
      },
      location: {
        type: String,
      },
    },
  ],
  images: [
    {
      type: String,
    },
  ],
  greenCreditsReward: {
    type: Number,
    default: 30,
  },
  co2Saved: {
    type: String,
    default: "1.2 kg",
  },
  returnId: {
    type: String,
  },
  sellerId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["available", "sold", "reserved"],
    default: "available",
  },
  soldTo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("RefurbishedProduct", refurbishedProductSchema);
