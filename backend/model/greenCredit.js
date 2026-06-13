const mongoose = require("mongoose");

const greenCreditSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  action: {
    type: String,
    enum: [
      "bought_refurbished",
      "donated_return",
      "sold_p2p",
      "kept_product",
      "return_graded",
      "redeemed",
      "welcome_bonus",
    ],
    required: true,
  },
  description: {
    type: String,
  },
  relatedProductId: {
    type: String,
  },
  co2Saved: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("GreenCredit", greenCreditSchema);
