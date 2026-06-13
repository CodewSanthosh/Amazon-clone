const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const RefurbishedProduct = require("../model/refurbishedProduct");
const Return = require("../model/return");
const GreenCredit = require("../model/greenCredit");

// GET /api/v2/refurbished/products — Get all available refurbished products
router.get(
  "/products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { category, minScore, maxPrice, sort } = req.query;

      let query = { status: "available" };

      if (category) query.category = category;
      if (minScore) query.conditionScore = { $gte: Number(minScore) };
      if (maxPrice) query.refurbPrice = { $lte: Number(maxPrice) };

      let sortOption = { createdAt: -1 };
      if (sort === "price_low") sortOption = { refurbPrice: 1 };
      if (sort === "price_high") sortOption = { refurbPrice: -1 };
      if (sort === "score") sortOption = { conditionScore: -1 };

      const products = await RefurbishedProduct.find(query).sort(sortOption);

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// GET /api/v2/refurbished/product/:id — Get single refurbished product
router.get(
  "/product/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await RefurbishedProduct.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// POST /api/v2/refurbished/list — Create a refurbished listing (from approved return)
router.post(
  "/list",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {
        name,
        description,
        category,
        originalPrice,
        refurbPrice,
        conditionScore,
        trustScore,
        defects,
        images,
        greenCreditsReward,
        co2Saved,
        returnId,
        sellerId,
      } = req.body;

      if (!name || !category || !originalPrice || !refurbPrice || !conditionScore) {
        return next(
          new ErrorHandler("name, category, originalPrice, refurbPrice, and conditionScore are required", 400)
        );
      }

      const product = await RefurbishedProduct.create({
        name,
        description: description || `Certified refurbished ${name}. AI-verified quality.`,
        category,
        originalPrice,
        refurbPrice,
        conditionScore,
        trustScore: trustScore || Math.round(conditionScore * 10 + Math.random() * 5),
        defects: defects || [],
        images: images || [],
        greenCreditsReward: greenCreditsReward || Math.round(conditionScore * 5),
        co2Saved: co2Saved || `${(conditionScore * 0.15).toFixed(1)} kg`,
        returnId: returnId || null,
        sellerId: sellerId || null,
      });

      // Update return status if linked
      if (returnId) {
        await Return.findByIdAndUpdate(returnId, { status: "listed" });
      }

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// POST /api/v2/refurbished/purchase — Purchase a refurbished product
router.post(
  "/purchase",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { productId, userId } = req.body;

      if (!productId || !userId) {
        return next(new ErrorHandler("productId and userId are required", 400));
      }

      const product = await RefurbishedProduct.findById(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      if (product.status !== "available") {
        return next(new ErrorHandler("Product is no longer available", 400));
      }

      // Mark as sold
      product.status = "sold";
      product.soldTo = userId;
      await product.save();

      // Award green credits to buyer
      await GreenCredit.create({
        userId,
        amount: product.greenCreditsReward,
        action: "bought_refurbished",
        description: `Purchased refurbished: ${product.name}`,
        relatedProductId: product._id.toString(),
        co2Saved: product.co2Saved?.replace(" kg", "") || "1.2",
      });

      // Update return status if linked
      if (product.returnId) {
        await Return.findByIdAndUpdate(product.returnId, { status: "sold" });
      }

      res.status(200).json({
        success: true,
        message: "Purchase successful! Green Credits awarded.",
        creditsEarned: product.greenCreditsReward,
        co2Saved: product.co2Saved,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// POST /api/v2/refurbished/seed — Seed demo refurbished products
router.post(
  "/seed",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const demoProducts = [
        {
          name: "iPhone 14 Pro - Certified Refurbished",
          description: "Like-new condition. AI verified with minor micro-scratch on back panel. Full functionality tested.",
          category: "Electronics",
          originalPrice: 79999,
          refurbPrice: 54999,
          conditionScore: 9.2,
          trustScore: 96,
          defects: [{ type: "Scratch", severity: "Minor", location: "Back panel" }],
          images: ["https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg"],
          greenCreditsReward: 80,
          co2Saved: "2.1 kg",
        },
        {
          name: "MacBook Pro M2 - Certified Refurbished",
          description: "Excellent condition. Light wear on palm rest. All ports and features working perfectly.",
          category: "Electronics",
          originalPrice: 129900,
          refurbPrice: 89999,
          conditionScore: 8.7,
          trustScore: 94,
          defects: [{ type: "Wear", severity: "Minimal", location: "Palm rest area" }],
          images: ["https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png"],
          greenCreditsReward: 120,
          co2Saved: "4.5 kg",
        },
        {
          name: "Sony WH-1000XM5 - Certified Refurbished",
          description: "Near-perfect condition. No visible defects. Noise cancellation tested and verified.",
          category: "Electronics",
          originalPrice: 29990,
          refurbPrice: 18999,
          conditionScore: 9.5,
          trustScore: 98,
          defects: [{ type: "None", severity: "None", location: "N/A" }],
          images: ["https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg"],
          greenCreditsReward: 40,
          co2Saved: "0.8 kg",
        },
        {
          name: "Samsung Galaxy Watch 5 - Certified Refurbished",
          description: "Good condition with faint scratch on bezel. All health sensors working accurately.",
          category: "Electronics",
          originalPrice: 27999,
          refurbPrice: 16499,
          conditionScore: 8.9,
          trustScore: 95,
          defects: [{ type: "Scratch", severity: "Minor", location: "Bezel" }],
          images: ["https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1"],
          greenCreditsReward: 35,
          co2Saved: "0.5 kg",
        },
        {
          name: "iPad Air M1 - Certified Refurbished",
          description: "Excellent condition. Minimal signs of use. Screen and battery in great shape.",
          category: "Electronics",
          originalPrice: 59900,
          refurbPrice: 42999,
          conditionScore: 9.0,
          trustScore: 96,
          defects: [{ type: "Wear", severity: "Minimal", location: "Edges" }],
          images: ["https://m.media-amazon.com/images/I/61NGnpjoRDL._SL1500_.jpg"],
          greenCreditsReward: 60,
          co2Saved: "1.8 kg",
        },
        {
          name: "JBL Flip 6 Speaker - Certified Refurbished",
          description: "Good condition. Minor scuff on bottom. Sound quality tested and certified.",
          category: "Electronics",
          originalPrice: 12999,
          refurbPrice: 7999,
          conditionScore: 8.2,
          trustScore: 92,
          defects: [{ type: "Scuff", severity: "Minor", location: "Bottom" }],
          images: ["https://m.media-amazon.com/images/I/71sYPUs8WyL._SL1500_.jpg"],
          greenCreditsReward: 25,
          co2Saved: "0.4 kg",
        },
      ];

      // Clear existing and insert fresh
      await RefurbishedProduct.deleteMany({});
      const products = await RefurbishedProduct.insertMany(demoProducts);

      res.status(201).json({
        success: true,
        message: `Seeded ${products.length} refurbished products`,
        count: products.length,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
