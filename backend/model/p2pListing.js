const mongoose = require("mongoose");

const p2pListingSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    required: true,
  },
  sellerName: {
    type: String,
    required: true,
  },
  sellerEmail: {
    type: String,
  },
  productName: {
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
  askingPrice: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  conditionScore: {
    type: Number,
    min: 0,
    max: 10,
  },
  conditionDescription: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  aiVerified: {
    type: Boolean,
    default: false,
  },
  healthCard: {
    conditionScore: Number,
    trustScore: Number,
    defects: Array,
    verifiedAt: Date,
  },
  greenCreditsReward: {
    type: Number,
    default: 60,
  },
  status: {
    type: String,
    enum: ["active", "sold", "removed"],
    default: "active",
  },
  buyerId: {
    type: String,
  },
  interestedUsers: [
    {
      userId: String,
      userName: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("P2PListing", p2pListingSchema);
