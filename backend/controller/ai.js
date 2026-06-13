const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Return = require("../model/return");
const { upload } = require("../multer");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const getGeminiModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

// Helper: Convert image file to Gemini-compatible format
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType,
    },
  };
}

// Helper: Calculate green credits based on decision
function calculateGreenCredits(decision) {
  const creditMap = {
    "Resell as Certified Refurbished": 50,
    "Refurbish then Resell": 40,
    "Donate": 75,
    "Recycle": 30,
    "Peer-to-Peer Marketplace": 60,
  };
  return creditMap[decision] || 30;
}

// Helper: Estimate CO2 saved based on decision
function estimateCO2Saved(decision) {
  const co2Map = {
    "Resell as Certified Refurbished": "1.2 kg",
    "Refurbish then Resell": "0.9 kg",
    "Donate": "1.5 kg",
    "Recycle": "0.4 kg",
    "Peer-to-Peer Marketplace": "1.3 kg",
  };
  return co2Map[decision] || "0.5 kg";
}

// POST /api/v2/ai/grade-product — AI quality grading with image
router.post(
  "/grade-product",
  upload.array("images", 4),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { productName, returnReason, productCategory, userId, user, orderId } = req.body;

      if (!req.files || req.files.length === 0) {
        return next(new ErrorHandler("Please upload at least one product image", 400));
      }

      if (!process.env.GEMINI_API_KEY) {
        return next(new ErrorHandler("Gemini API key not configured", 500));
      }

      const model = getGeminiModel();

      // Prepare images for Gemini
      const imageParts = req.files.map((file) => {
        const mimeType = file.mimetype || "image/png";
        return fileToGenerativePart(file.path, mimeType);
      });

      // Structured prompt for AI grading
      const prompt = `You are an AI product quality grader for Amazon's Second Life Commerce platform. 
Analyze the product image(s) and provide a detailed quality assessment.

Product: ${productName || "Unknown product"}
Category: ${productCategory || "General"}
Return Reason: ${returnReason || "Not specified"}

Respond ONLY with a valid JSON object (no markdown, no code blocks, no extra text) with exactly this structure:
{
  "conditionScore": <number 1-10, where 10 is like-new>,
  "trustScore": <number 60-100, buyer trust percentage>,
  "aiConfidence": <number 70-99, your confidence in this assessment>,
  "defects": [
    {
      "type": "<defect type: Scratch, Dent, Wear, Discoloration, Crack, Stain, Missing Part, None>",
      "severity": "<None, Minimal, Minor, Moderate, Major, or Severe>",
      "location": "<where on the product>"
    }
  ],
  "decision": "<exactly one of: Resell as Certified Refurbished, Refurbish then Resell, Donate, Recycle, Peer-to-Peer Marketplace>",
  "suggestedPrice": <number, estimated fair resale price in INR>,
  "reasoning": "<2-3 sentence explanation of your decision>"
}

Decision criteria:
- Score 8-10: "Resell as Certified Refurbished" (excellent condition, minor cosmetic issues only)
- Score 6-7.9: "Peer-to-Peer Marketplace" (good condition, some visible wear)
- Score 4-5.9: "Refurbish then Resell" (needs repair/cleaning but salvageable)
- Score 2-3.9: "Donate" (functional but not marketable)
- Score 0-1.9: "Recycle" (non-functional or heavily damaged)`;

      // Call Gemini Vision
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      let text = response.text();

      // Clean up response (remove markdown code blocks if present)
      text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      let aiResult;
      try {
        aiResult = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", text);
        return next(new ErrorHandler("AI returned an invalid response. Please try again.", 500));
      }

      // Calculate green credits and CO2
      const greenCreditsEarned = calculateGreenCredits(aiResult.decision);
      const co2Saved = estimateCO2Saved(aiResult.decision);

      // Save image paths (relative URLs)
      const imageUrls = req.files.map((file) => file.filename);

      // Create return record in database
      const returnRecord = await Return.create({
        userId: userId || "anonymous",
        user: user ? JSON.parse(user) : { name: "Anonymous" },
        orderId: orderId || null,
        productName: productName || "Unknown Product",
        productCategory: productCategory || "General",
        returnReason: returnReason || "Not specified",
        images: imageUrls,
        aiGrading: {
          conditionScore: aiResult.conditionScore,
          trustScore: aiResult.trustScore,
          aiConfidence: aiResult.aiConfidence,
          defects: aiResult.defects,
          decision: aiResult.decision,
          suggestedPrice: aiResult.suggestedPrice,
          reasoning: aiResult.reasoning,
        },
        greenCreditsEarned,
        co2Saved,
        status: "ai_graded",
        healthCard: {
          generatedAt: new Date(),
          verifiedBy: "Gemini AI",
        },
      });

      // Return the full result to frontend
      res.status(200).json({
        success: true,
        result: {
          conditionScore: aiResult.conditionScore,
          trustScore: aiResult.trustScore,
          aiConfidence: aiResult.aiConfidence,
          defects: aiResult.defects,
          decision: aiResult.decision,
          suggestedPrice: aiResult.suggestedPrice,
          reasoning: aiResult.reasoning,
          greenCreditsEarned,
          co2Saved,
        },
        returnId: returnRecord._id,
        healthCard: returnRecord.healthCard,
      });
    } catch (error) {
      // Clean up uploaded files on error
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlink(file.path, () => {});
        });
      }
      // Handle rate limits gracefully
      if (error.message && error.message.includes("429")) {
        return next(new ErrorHandler("AI service is temporarily busy. Please try again in a minute.", 429));
      }
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// POST /api/v2/ai/return-risk — Predict return probability for a product
router.post(
  "/return-risk",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { productName, productCategory, productPrice, productDescription } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return next(new ErrorHandler("Gemini API key not configured", 500));
      }

      const model = getGeminiModel();

      const prompt = `You are an AI return-risk predictor for Amazon. Based on the product information, predict the likelihood of this product being returned and provide actionable suggestions.

Product: ${productName}
Category: ${productCategory || "General"}
Price: ₹${productPrice || "N/A"}
Description: ${productDescription || "N/A"}

Respond ONLY with a valid JSON object (no markdown, no code blocks):
{
  "returnProbability": <number 0-100, percentage chance of return>,
  "riskLevel": "<low, medium, or high>",
  "topReasons": [
    "<most common return reason for this type of product>",
    "<second most common reason>",
    "<third reason>"
  ],
  "preventionTips": [
    "<actionable tip to prevent return>",
    "<second tip>",
    "<third tip>"
  ],
  "keepIncentive": "<short message encouraging the user to keep the product, mentioning Green Credits>"
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      let riskResult;
      try {
        riskResult = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse return risk response:", text);
        return next(new ErrorHandler("AI returned an invalid response", 500));
      }

      res.status(200).json({
        success: true,
        ...riskResult,
      });
    } catch (error) {
      if (error.message && error.message.includes("429")) {
        return next(new ErrorHandler("AI service is temporarily busy. Please try again in a minute.", 429));
      }
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// GET /api/v2/ai/returns/:userId — Get user's return history
router.get(
  "/returns/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const returns = await Return.find({ userId: req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        returns,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// GET /api/v2/ai/returns — Get all returns (admin)
router.get(
  "/returns",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const returns = await Return.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        returns,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// PUT /api/v2/ai/return-status/:id — Update return status
router.put(
  "/return-status/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const returnRecord = await Return.findById(req.params.id);

      if (!returnRecord) {
        return next(new ErrorHandler("Return not found", 404));
      }

      returnRecord.status = req.body.status;
      await returnRecord.save();

      res.status(200).json({
        success: true,
        return: returnRecord,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
