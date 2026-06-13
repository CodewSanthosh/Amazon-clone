const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Notification = require("../model/notification");
const ProductInterest = require("../model/productInterest");

// POST /api/v2/notifications/track-interest — Track user interest in a product
router.post(
  "/track-interest",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { userId, userName, productId, productName, productCategory, interactionType } = req.body;

      if (!userId || !productId || !productName || !interactionType) {
        return next(new ErrorHandler("userId, productId, productName, and interactionType are required", 400));
      }

      // Upsert — don't duplicate for same user + product + type
      await ProductInterest.findOneAndUpdate(
        { userId, productId, interactionType },
        {
          userId,
          userName: userName || "User",
          productId,
          productName,
          productCategory: productCategory || "",
          interactionType,
          createdAt: new Date(),
        },
        { upsert: true, new: true }
      );

      res.status(200).json({ success: true });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// POST /api/v2/notifications/notify-return — When a product is returned, notify interested users
router.post(
  "/notify-return",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {
        productName, productCategory, returnId,
        conditionScore, suggestedPrice, originalPrice,
        productImage, returnerId,
      } = req.body;

      if (!productName) {
        return next(new ErrorHandler("productName is required", 400));
      }

      // Find all users who viewed, wishlisted, or carted this product (or similar ones)
      // Use regex to match similar product names (fuzzy)
      const keywords = productName.split(" ").filter((w) => w.length > 3).slice(0, 3);
      const searchRegex = keywords.map((k) => `(?=.*${k})`).join("");

      const interestedUsers = await ProductInterest.find({
        productName: { $regex: searchRegex, $options: "i" },
        userId: { $ne: returnerId || "" }, // Don't notify the person who returned it
      });

      // De-duplicate by userId
      const uniqueUsers = [];
      const seenUserIds = new Set();
      for (const interest of interestedUsers) {
        if (!seenUserIds.has(interest.userId)) {
          seenUserIds.add(interest.userId);
          uniqueUsers.push(interest);
        }
      }

      // Calculate offer price (discounted from original)
      const discount = conditionScore ? Math.round((10 - conditionScore) * 5 + 10) : 30;
      const offerPrice = suggestedPrice || (originalPrice ? Math.round(originalPrice * (1 - discount / 100)) : null);

      // Create notifications for each interested user
      const notifications = [];
      for (const user of uniqueUsers) {
        const notification = await Notification.create({
          userId: user.userId,
          type: "return_nearby",
          title: "🔔 A product you're interested in just became available!",
          message: `"${productName}" has been returned in ${conditionScore ? conditionScore + '/10' : 'good'} condition and is available at a discounted price. Buy now to save shipping costs — it's nearby!`,
          productName,
          productImage: productImage || null,
          returnId: returnId || null,
          discount,
          originalPrice: originalPrice || null,
          offerPrice,
          actionUrl: "/refurbished",
          expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
        });
        notifications.push(notification);
      }

      res.status(201).json({
        success: true,
        message: `Notified ${notifications.length} interested user(s)`,
        notifiedCount: notifications.length,
        notifiedUsers: uniqueUsers.map((u) => ({
          userId: u.userId,
          userName: u.userName,
          interactionType: u.interactionType,
        })),
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// GET /api/v2/notifications/:userId — Get user's notifications
router.get(
  "/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const notifications = await Notification.find({
        userId: req.params.userId,
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gt: new Date() } },
        ],
      }).sort({ createdAt: -1 }).limit(20);

      const unreadCount = notifications.filter((n) => !n.read).length;

      res.status(200).json({
        success: true,
        notifications,
        unreadCount,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// PUT /api/v2/notifications/mark-read/:id — Mark notification as read
router.put(
  "/mark-read/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      await Notification.findByIdAndUpdate(req.params.id, { read: true });
      res.status(200).json({ success: true });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// PUT /api/v2/notifications/mark-all-read/:userId — Mark all as read
router.put(
  "/mark-all-read/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      await Notification.updateMany(
        { userId: req.params.userId, read: false },
        { read: true }
      );
      res.status(200).json({ success: true });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
