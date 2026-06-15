const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Return = require("../model/return");
const Order = require("../model/order");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const getGeminiModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

// POST /api/v2/seller-analytics/return-insights — AI analysis of returns for seller
router.post(
  "/return-insights",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { shopId, productName, productCategory, returnReason, originalPrice, daysSincePurchase } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return next(new ErrorHandler("AI service not configured", 500));
      }

      const model = getGeminiModel();

      const prompt = `You are an AI logistics and returns analyst for Amazon Seller Central. A product has been returned. Analyze this return and provide insights that help BOTH the seller AND Amazon optimize costs.

Product: ${productName || "Unknown"}
Category: ${productCategory || "General"}
Return Reason: ${returnReason || "Not specified"}
Original Price: ₹${originalPrice || "N/A"}
Days Since Purchase: ${daysSincePurchase || "Unknown"}

Respond ONLY with valid JSON (no markdown):
{
  "returnDelayRecommendation": {
    "canDelay": <boolean - can the return pickup be delayed to batch with nearby returns?>,
    "recommendedDelayDays": <number 0-5 - how many days can pickup be delayed without customer impact>,
    "reason": "<why this delay is acceptable or not>"
  },
  "costAnalysis": {
    "estimatedReturnShipping": <number in INR>,
    "estimatedRefurbCost": <number in INR - cost to make it resellable>,
    "potentialResaleValue": <number in INR>,
    "sellerLoss": <number in INR - net loss for seller>,
    "amazonRecovery": <number in INR - what Amazon can recover via refurbished resale>,
    "netSavingsIfNearbyBuyer": <number in INR - saved if shipped directly to nearby interested user>
  },
  "sellerTips": [
    "<tip 1 to reduce future returns of this type>",
    "<tip 2>",
    "<tip 3>"
  ],
  "batchingOpportunity": {
    "canBatch": <boolean - can this return be batched with other nearby pickups?>,
    "estimatedBatchSaving": <number in INR - logistics saving if batched>,
    "explanation": "<short explanation>"
  },
  "profitSplit": {
    "sellerShare": <percentage of resale revenue going to seller>,
    "amazonShare": <percentage going to Amazon as service fee>,
    "explanation": "<how this benefits both parties>"
  }
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      let insights;
      try {
        insights = JSON.parse(text);
      } catch (parseError) {
        return next(new ErrorHandler("AI returned invalid response. Try again.", 500));
      }

      res.status(200).json({
        success: true,
        insights,
      });
    } catch (error) {
      if (error.message && error.message.includes("429")) {
        return next(new ErrorHandler("AI service temporarily busy. Try again in a minute.", 429));
      }
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// GET /api/v2/seller-analytics/dashboard/:shopId — Get seller return analytics
router.get(
  "/dashboard/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { shopId } = req.params;

      // Get all returns related to this shop's products (check both shopId and sellerId fields)
      const returns = await Return.find({
        $or: [
          { shopId: shopId },
          { sellerId: shopId },
          { shopId: { $exists: true, $ne: "" } } // Fallback: show all returns with any shopId for demo
        ]
      }).sort({ createdAt: -1 });

      // Calculate stats
      const totalReturns = returns.length;
      const totalGraded = returns.filter((r) => r.status === "ai_graded" || r.status === "approved" || r.status === "listed" || r.status === "sold").length;
      const listedAsRefurbished = returns.filter((r) => r.status === "listed" || r.status === "sold").length;
      const soldRefurbished = returns.filter((r) => r.status === "sold").length;

      // Revenue recovered from sold refurbished items
      const revenueRecovered = returns
        .filter((r) => r.status === "sold" && r.aiGrading?.suggestedPrice)
        .reduce((sum, r) => sum + (r.aiGrading.suggestedPrice || 0), 0);

      // Average condition score
      const avgCondition = returns.length > 0
        ? (returns.reduce((sum, r) => sum + (r.aiGrading?.conditionScore || 0), 0) / returns.length).toFixed(1)
        : 0;

      // Top return reasons
      const reasonCounts = {};
      returns.forEach((r) => {
        const reason = r.returnReason || "Unknown";
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      });
      const topReasons = Object.entries(reasonCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([reason, count]) => ({ reason, count }));

      res.status(200).json({
        success: true,
        analytics: {
          totalReturns,
          totalGraded,
          listedAsRefurbished,
          soldRefurbished,
          revenueRecovered,
          avgCondition,
          topReasons,
          amazonServiceFee: Math.round(revenueRecovered * 0.15), // 15% Amazon fee
          sellerRecovery: Math.round(revenueRecovered * 0.85), // 85% to seller
        },
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
