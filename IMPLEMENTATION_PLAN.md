# 🚀 Implementation Plan: Second Life Commerce

## Priority Framework
Features ranked by: **Hackathon Demo Impact** × **Feasibility (time to build)**

---

## Phase 1: AI Core (HIGH PRIORITY — Do First)
> These make the demo *wow*. They connect the existing frontend to real AI.

### 1.1 — Gemini AI Quality Grading API
**What:** Backend endpoint that accepts product images and returns AI-generated condition analysis.

**Why:** The Return Portal already has the full UI (upload → analyze → result). It just calls `setTimeout`. Connecting real AI makes this the star demo feature.

**Build:**
- `backend/controller/ai.js` — New route `/api/v2/ai/grade-product`
- Send image to Gemini Vision API with a structured prompt:
  - Detect defects (scratches, dents, wear)
  - Generate condition score (1-10)
  - Suggest routing decision (resell/refurbish/donate/recycle)
  - Estimate fair resale price
  - Calculate trust score & confidence
- Return structured JSON matching the frontend's expected `result` object
- Update `ReturnPortalPage.jsx` to call real API instead of setTimeout

**Effort:** ~2-3 hours

---

### 1.2 — Smart Routing Engine
**What:** AI decides the best "second life" path for a returned product.

**Why:** This is the core thesis of the project. The AI doesn't just grade — it *decides*.

**Build:**
- Part of the `/api/v2/ai/grade-product` response (Gemini prompt engineering)
- Decision matrix based on:
  - Condition score > 7 → **Resell as Certified Refurbished**
  - Condition score 5-7 → **Refurbish then Resell**
  - Condition score 3-5 → **Donate**
  - Condition score < 3 → **Recycle**
  - High demand category + good condition → **Peer-to-peer marketplace**
- Store decision in a new `Return` model

**Effort:** Included in 1.1 (prompt engineering + model)

---

### 1.3 — Return Model & Health Card Storage
**What:** Persist AI grading results in the database.

**Build:**
- `backend/model/return.js` — New Mongoose schema:
  ```
  - userId, orderId, productId
  - images[] (uploaded photos)
  - returnReason
  - aiGrading: { conditionScore, trustScore, aiConfidence, defects[], decision, suggestedPrice, reasoning }
  - greenCreditsEarned
  - co2Saved
  - status: "pending" | "approved" | "listed" | "sold" | "donated" | "recycled"
  - healthCard: { generatedAt, verifiedBy: "Gemini AI" }
  - createdAt
  ```
- `backend/controller/return.js` — CRUD endpoints:
  - `POST /create-return` — Submit return with AI grading
  - `GET /get-returns/:userId` — User's return history
  - `GET /get-all-returns` — Admin view
  - `PUT /update-return-status/:id` — Admin/seller update

**Effort:** ~1-2 hours

---

## Phase 2: Green Credits System (HIGH PRIORITY)
> The credits page exists with beautiful UI. It just needs a real backend.

### 2.1 — Green Credits Model & API
**What:** Track credits earned/spent per user.

**Build:**
- Add to `user` model: `greenCredits: { balance: Number, totalEarned: Number, totalSpent: Number }`
- `backend/model/greenCredits.js` — Transaction log:
  ```
  - userId
  - amount (+/-)
  - action (bought_refurbished, donated_return, kept_product, sold_p2p, redeemed)
  - relatedProductId
  - co2Saved
  - createdAt
  ```
- `backend/controller/greenCredits.js`:
  - `GET /balance/:userId` — Current balance + stats
  - `GET /history/:userId` — Transaction history
  - `POST /earn` — Award credits (called after return/purchase)
  - `POST /redeem` — Spend credits for discount

**Credit Rules:**
| Action | Credits |
|--------|---------|
| Buy refurbished product | +30 |
| Donate a return | +75 |
| Sell via peer-to-peer | +60 |
| Keep product (return prevention) | +20 |
| Redeem for ₹50 discount | -100 |

**Effort:** ~2 hours

---

## Phase 3: Refurbished Marketplace (MEDIUM PRIORITY)
> Turn the mock refurbished page into a real, dynamic marketplace.

### 3.1 — Refurbished Product Listings
**What:** Products routed to "resell" from the AI grading become refurbished listings.

**Build:**
- Add fields to Product model (or create `RefurbishedProduct` model):
  ```
  - isRefurbished: Boolean
  - conditionScore: Number
  - trustScore: Number
  - defects: [{ type, severity, location }]
  - healthCardId (ref to Return)
  - originalProductId
  - greenCreditsReward: Number
  - co2Saved: String
  ```
- `backend/controller/refurbished.js`:
  - `GET /get-all-refurbished` — List refurbished products
  - `POST /list-refurbished` — Auto-create listing from approved return
- Update `RefurbishedPage.jsx` to fetch from API
- Add "Add to Cart" functionality (use existing cart system)

**Effort:** ~2-3 hours

---

## Phase 4: Return Prevention (MEDIUM-HIGH PRIORITY)
> Predictive AI that warns users *before* they buy something likely to be returned.

### 4.1 — Predictive Return Risk Assessment
**What:** Show a warning/recommendation on the product page if a product has high return probability for that user.

**Build:**
- `backend/controller/ai.js` — Add endpoint `/api/v2/ai/return-risk`
- Gemini prompt analyzes:
  - Product category return rates
  - User's past return history
  - Common return reasons for this product type
  - Size/compatibility factors
- Frontend: Add a subtle banner on `ProductDetailsPage` like:
  > "⚠️ 23% of buyers return this item due to size issues. Check the size guide → "
  > "💡 Keep it? Earn +20 Green Credits if you don't return."
- Also show on checkout as a "return prevention nudge"

**Effort:** ~2 hours

---

## Phase 5: Peer-to-Peer Resale (LOWER PRIORITY for hackathon)
> Nice-to-have. Complex but impressive if you get it working.

### 5.1 — P2P Listing System
**What:** Users can list their own products for resale within Amazon's ecosystem.

**Build:**
- `backend/model/p2pListing.js`:
  ```
  - sellerId (regular user, not shop)
  - productName, description, images[]
  - askingPrice
  - conditionScore (self-assessed + optional AI verify)
  - category
  - status: "active" | "sold" | "removed"
  - healthCard (if AI graded)
  ```
- New frontend page: `/sell-my-stuff`
  - Upload form with AI grading option
  - Suggested price from AI
  - List in marketplace
- Buyer flow: browse → message seller → purchase (escrow via existing payment)
- Award 60 green credits on successful sale

**Effort:** ~4-5 hours

---

## Phase 6: Sustainability Dashboard (DEMO POLISH)
> Makes the admin/impact numbers real instead of static.

### 6.1 — Real Impact Metrics
**What:** Replace hardcoded stats with actual aggregated data.

**Build:**
- `backend/controller/sustainability.js`:
  - `GET /api/v2/sustainability/stats` — Aggregate:
    - Total products reused (count of sold refurbished items)
    - Total CO₂ saved (sum from all returns)
    - Revenue recovered (sum of refurbished sales)
    - Returns prevented (count of "kept" decisions)
    - Total green credits in circulation
- Update `GreenImpactStats.jsx` to fetch live data

**Effort:** ~1 hour

---

## Suggested Build Order (Hackathon Sprint)

```
Day 1 (Core AI):
├── 1.1 Gemini AI Grading API + connect to Return Portal  [3 hrs]
├── 1.3 Return Model & persistence                        [1 hr]
└── 2.1 Green Credits backend + connect to page           [2 hrs]

Day 2 (Marketplace + Prevention):
├── 3.1 Refurbished marketplace (real data)               [2 hrs]
├── 4.1 Return Prevention predictions                     [2 hrs]
└── 6.1 Live sustainability stats                         [1 hr]

Day 3 (Polish + Bonus):
├── 5.1 Peer-to-peer resale (if time allows)             [4 hrs]
├── Bug fixes, UI polish, demo prep                       [2 hrs]
└── README + presentation materials                       [1 hr]
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `backend/controller/ai.js` | Gemini AI grading + return prevention |
| `backend/model/return.js` | Return/Health Card schema |
| `backend/model/greenCredit.js` | Credit transaction log |
| `backend/controller/greenCredits.js` | Credits API |
| `backend/controller/refurbished.js` | Refurbished marketplace API |
| `backend/controller/sustainability.js` | Live impact stats |
| `backend/model/p2pListing.js` | Peer-to-peer listings (Phase 5) |
| `frontend/src/redux/actions/greenCredits.js` | Redux actions |
| `frontend/src/redux/reducers/greenCredits.js` | Redux reducer |

---

## Key Dependency

You'll need the **Gemini API key** added to `backend/config/.env`:
```
GEMINI_API_KEY = your_key_here
```
Get one free at: https://aistudio.google.com/apikey

---

## Demo Story (for judges)

1. **User buys a product** → normal e-commerce flow (already works)
2. **User initiates return** → uploads photos in Return Portal
3. **AI grades product in real-time** → condition score, defects, Health Card generated
4. **AI decides routing** → "Resell as Certified Refurbished"
5. **Product appears in Refurbished marketplace** → with Health Card & trust score
6. **Another user buys it** → earns Green Credits, sees CO₂ saved
7. **Return Prevention** → before purchase, AI warns about likely returns
8. **Green Credits grow** → user redeems for discounts, creating a virtuous cycle

Every product gets a meaningful second life. ♻️
