const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const P2PListing = require("../model/p2pListing");
const GreenCredit = require("../model/greenCredit");
const { upload } = require("../multer");

// GET /api/v2/p2p/listings — Get all active P2P listings
router.get(
  "/listings",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { category, maxPrice, sort } = req.query;

      let query = { status: "active" };
      if (category) query.category = category;
      if (maxPrice) query.askingPrice = { $lte: Number(maxPrice) };

      let sortOption = { createdAt: -1 };
      if (sort === "price_low") sortOption = { askingPrice: 1 };
      if (sort === "price_high") sortOption = { askingPrice: -1 };
      if (sort === "newest") sortOption = { createdAt: -1 };

      const listings = await P2PListing.find(query).sort(sortOption);

      res.status(200).json({
        success: true,
        listings,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// GET /api/v2/p2p/listing/:id — Get single listing
router.get(
  "/listing/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const listing = await P2PListing.findById(req.params.id);
      if (!listing) {
        return next(new ErrorHandler("Listing not found", 404));
      }
      res.status(200).json({ success: true, listing });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// GET /api/v2/p2p/my-listings/:userId — Get user's own listings
router.get(
  "/my-listings/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const listings = await P2PListing.find({ sellerId: req.params.userId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, listings });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// POST /api/v2/p2p/create — Create a new P2P listing
router.post(
  "/create",
  upload.array("images", 4),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {
        sellerId, sellerName, sellerEmail,
        productName, description, category,
        askingPrice, originalPrice,
        conditionScore, conditionDescription,
      } = req.body;

      if (!sellerId || !productName || !category || !askingPrice) {
        return next(new ErrorHandler("sellerId, productName, category, and askingPrice are required", 400));
      }

      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        imageUrls = req.files.map((file) => file.filename);
      }

      const listing = await P2PListing.create({
        sellerId,
        sellerName: sellerName || "Anonymous Seller",
        sellerEmail: sellerEmail || "",
        productName,
        description: description || "",
        category,
        askingPrice: Number(askingPrice),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        conditionScore: conditionScore ? Number(conditionScore) : null,
        conditionDescription: conditionDescription || "",
        images: imageUrls,
        greenCreditsReward: 60,
      });

      res.status(201).json({
        success: true,
        listing,
        message: "Your product is now listed on the P2P marketplace!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// POST /api/v2/p2p/express-interest — Express interest in a listing
router.post(
  "/express-interest",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { listingId, userId, userName } = req.body;

      if (!listingId || !userId) {
        return next(new ErrorHandler("listingId and userId are required", 400));
      }

      const listing = await P2PListing.findById(listingId);
      if (!listing) {
        return next(new ErrorHandler("Listing not found", 404));
      }

      // Check if already interested
      const alreadyInterested = listing.interestedUsers.find(
        (u) => u.userId === userId
      );
      if (alreadyInterested) {
        return res.status(200).json({ success: true, message: "You've already expressed interest" });
      }

      listing.interestedUsers.push({ userId, userName: userName || "User" });
      await listing.save();

      res.status(200).json({
        success: true,
        message: "Interest expressed! The seller will be notified.",
        interestedCount: listing.interestedUsers.length,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// POST /api/v2/p2p/purchase — Purchase a P2P listing
router.post(
  "/purchase",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { listingId, buyerId } = req.body;

      if (!listingId || !buyerId) {
        return next(new ErrorHandler("listingId and buyerId are required", 400));
      }

      const listing = await P2PListing.findById(listingId);
      if (!listing) {
        return next(new ErrorHandler("Listing not found", 404));
      }
      if (listing.status !== "active") {
        return next(new ErrorHandler("This listing is no longer available", 400));
      }

      // Mark as sold
      listing.status = "sold";
      listing.buyerId = buyerId;
      await listing.save();

      // Award green credits to buyer
      await GreenCredit.create({
        userId: buyerId,
        amount: listing.greenCreditsReward,
        action: "bought_refurbished",
        description: `Bought P2P: ${listing.productName}`,
        relatedProductId: listing._id.toString(),
        co2Saved: "1.3",
      });

      // Award green credits to seller
      await GreenCredit.create({
        userId: listing.sellerId,
        amount: 60,
        action: "sold_p2p",
        description: `Sold via P2P: ${listing.productName}`,
        relatedProductId: listing._id.toString(),
        co2Saved: "1.3",
      });

      res.status(200).json({
        success: true,
        message: "Purchase successful! Both buyer and seller earned Green Credits.",
        buyerCredits: listing.greenCreditsReward,
        sellerCredits: 60,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// DELETE /api/v2/p2p/remove/:id — Remove a listing (seller only)
router.delete(
  "/remove/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const listing = await P2PListing.findById(req.params.id);
      if (!listing) {
        return next(new ErrorHandler("Listing not found", 404));
      }
      listing.status = "removed";
      await listing.save();
      res.status(200).json({ success: true, message: "Listing removed" });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
