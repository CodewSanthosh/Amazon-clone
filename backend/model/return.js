const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  orderId: {
    type: String,
  },
  shopId: {
    type: String,
  },
  productName: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  returnReason: {
    type: String,
    required: true,
  },
  estimatedReturnDays: {
    type: Number,
    default: 3,
  },
  images: [
    {
      type: String,
    },
  ],
  aiGrading: {
    conditionScore: {
      type: Number,
      min: 0,
      max: 10,
    },
    trustScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    aiConfidence: {
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
          enum: ["None", "Minimal", "Minor", "Moderate", "Major", "Severe"],
        },
        location: {
          type: String,
        },
      },
    ],
    decision: {
      type: String,
      enum: [
        "Resell as Certified Refurbished",
        "Refurbish then Resell",
        "Donate",
        "Recycle",
        "Peer-to-Peer Marketplace",
      ],
    },
    suggestedPrice: {
      type: Number,
    },
    reasoning: {
      type: String,
    },
  },
  greenCreditsEarned: {
    type: Number,
    default: 0,
  },
  co2Saved: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "ai_graded", "approved", "listed", "sold", "donated", "recycled"],
    default: "pending",
  },
  healthCard: {
    generatedAt: {
      type: Date,
    },
    verifiedBy: {
      type: String,
      default: "Gemini AI",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Return", returnSchema);
