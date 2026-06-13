# 🏗️ Architecture Diagram — Amazon Second Life Commerce

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React 18 + Redux)                             │
│                                  localhost:3000                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  ┌────────────┐  ┌───────────┐ │
│  │   Home   │  │   Products   │  │ Return Portal │  │ Refurbished│  │  Green    │ │
│  │   Page   │  │  Marketplace │  │  (AI Grading) │  │ Marketplace│  │  Credits  │ │
│  └──────────┘  └──────────────┘  └───────────────┘  └────────────┘  └───────────┘ │
│                                                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  ┌────────────┐  ┌───────────┐ │
│  │  Seller  │  │    Admin     │  │   Checkout    │  │   Order    │  │   User    │ │
│  │Dashboard │  │  Dashboard   │  │  & Payment    │  │  Tracking  │  │  Profile  │ │
│  └──────────┘  └──────────────┘  └───────────────┘  └────────────┘  └───────────┘ │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                         Redux Store (State Management)                       │   │
│  │  ┌──────┐ ┌────────┐ ┌───────┐ ┌───────┐ ┌────────┐ ┌────────┐ ┌───────┐  │   │
│  │  │ User │ │Products│ │Orders │ │ Cart  │ │Wishlist│ │Sellers │ │Events │  │   │
│  │  └──────┘ └────────┘ └───────┘ └───────┘ └────────┘ └────────┘ └───────┘  │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
└────────────────────────────────┬────────────────────────────────────────────────────┘
                                 │ HTTP (Axios)
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐  ┌─────────────────────┐  ┌──────────────────┐
│  BACKEND (Node) │  │  SOCKET SERVER      │  │  EXTERNAL APIs   │
│  localhost:8000  │  │  localhost:4000      │  │                  │
│                  │  │                      │  │  ┌────────────┐  │
│  Express.js     │  │  Socket.io           │  │  │  Gemini AI │  │
│  REST API       │  │  Real-time Messaging │  │  │  (Vision)  │  │
│                  │  │                      │  │  └────────────┘  │
└────────┬─────────┘  └──────────────────────┘  │  ┌────────────┐  │
         │                                      │  │   Stripe   │  │
         │                                      │  │  Payments  │  │
         │                                      │  └────────────┘  │
         │                                      │  ┌────────────┐  │
         │                                      │  │   PayPal   │  │
         │                                      │  └────────────┘  │
         │                                      └──────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas (Cloud Database)                 │
│                  hackon.rkxojwo.mongodb.net/relife                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────┐ ┌────────┐ ┌─────────┐ ┌─────────┐ ┌───────────┐  │
│  │ Users  │ │ Shops  │ │Products │ │ Orders  │ │  Returns  │  │
│  └────────┘ └────────┘ └─────────┘ └─────────┘ └───────────┘  │
│  ┌────────────────┐ ┌───────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Conversations  │ │ Messages  │ │  Events  │ │  Coupons  │  │
│  └────────────────┘ └───────────┘ └──────────┘ └───────────┘  │
│  ┌────────────────┐                                             │
│  │   Withdrawals  │                                             │
│  └────────────────┘                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backend API Architecture

```
                        ┌─────────────────────────────┐
                        │       Express Server        │
                        │      (server.js:8000)       │
                        └──────────────┬──────────────┘
                                       │
                    ┌──────────────────┼──────────────────────┐
                    │                  │                      │
                    ▼                  ▼                      ▼
            ┌──────────────┐  ┌──────────────┐      ┌──────────────┐
            │  Middleware   │  │   Static     │      │    CORS      │
            │              │  │   Uploads     │      │  (port 3000) │
            └──────┬───────┘  └──────────────┘      └──────────────┘
                   │
     ┌─────────────┼─────────────────────────────────────────┐
     │             │                                         │
     ▼             ▼                                         ▼
┌─────────┐  ┌──────────┐                           ┌──────────────┐
│  Auth   │  │  Error   │                           │  Body Parser │
│(JWT/Cookie)│  │ Handler  │                           │  (50mb)      │
└─────────┘  └──────────┘                           └──────────────┘

                        API Routes (/api/v2/*)
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌──────────────────┐    ┌──────────────────┐    ┌───────────────┐ │
│  │  /user           │    │  /shop           │    │  /product     │ │
│  │  • signup        │    │  • create-shop   │    │  • create     │ │
│  │  • login         │    │  • login-shop    │    │  • get-all    │ │
│  │  • getuser       │    │  • get-shop-info │    │  • reviews    │ │
│  │  • logout        │    │  • update-info   │    │  • delete     │ │
│  │  • update-info   │    │  • logout        │    │               │ │
│  └──────────────────┘    └──────────────────┘    └───────────────┘ │
│                                                                     │
│  ┌──────────────────┐    ┌──────────────────┐    ┌───────────────┐ │
│  │  /order          │    │  /payment        │    │  /ai  ⭐ NEW  │ │
│  │  • create-order  │    │  • stripe-key    │    │  • grade      │ │
│  │  • get-orders    │    │  • process       │    │    -product   │ │
│  │  • update-status │    │                  │    │  • return-    │ │
│  │  • refund        │    │                  │    │    risk       │ │
│  │  • admin-orders  │    │                  │    │  • returns    │ │
│  └──────────────────┘    └──────────────────┘    └───────────────┘ │
│                                                                     │
│  ┌──────────────────┐    ┌──────────────────┐    ┌───────────────┐ │
│  │  /event          │    │  /conversation   │    │  /message     │ │
│  │  • create        │    │  • create        │    │  • create     │ │
│  │  • get-all       │    │  • get-seller    │    │  • get-all    │ │
│  │  • delete        │    │  • get-user      │    │               │ │
│  └──────────────────┘    └──────────────────┘    └───────────────┘ │
│                                                                     │
│  ┌──────────────────┐    ┌──────────────────┐                      │
│  │  /coupon         │    │  /withdraw       │                      │
│  │  • create        │    │  • create        │                      │
│  │  • get-value     │    │  • get-all       │                      │
│  │  • delete        │    │  • update        │                      │
│  └──────────────────┘    └──────────────────┘                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## AI Pipeline — Return Portal Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI RETURN PORTAL FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

  USER                    FRONTEND                  BACKEND                GEMINI AI
   │                        │                         │                       │
   │  Upload Photo +        │                         │                       │
   │  Product Details       │                         │                       │
   │───────────────────────►│                         │                       │
   │                        │                         │                       │
   │                        │  POST /ai/grade-product │                       │
   │                        │  (multipart/form-data)  │                       │
   │                        │────────────────────────►│                       │
   │                        │                         │                       │
   │                        │                         │  Image + Prompt       │
   │                        │                         │──────────────────────►│
   │                        │                         │                       │
   │                        │                         │  JSON Response:       │
   │                        │                         │  • conditionScore     │
   │                        │                         │  • defects[]          │
   │                        │                         │  • decision           │
   │                        │                         │  • suggestedPrice     │
   │                        │                         │◄──────────────────────│
   │                        │                         │                       │
   │                        │                         │  Save to MongoDB      │
   │                        │                         │  (Return model)       │
   │                        │                         │                       │
   │                        │  AI Health Card +       │                       │
   │                        │  Routing Decision       │                       │
   │                        │◄────────────────────────│                       │
   │                        │                         │                       │
   │  Display Results:      │                         │                       │
   │  • Health Card         │                         │                       │
   │  • Score: 7.8/10       │                         │                       │
   │  • Decision: Resell    │                         │                       │
   │  • Credits: +50 🌱     │                         │                       │
   │◄───────────────────────│                         │                       │
   │                        │                         │                       │
```

---

## Smart Routing Decision Tree

```
                    ┌─────────────────────┐
                    │   AI Grades Product  │
                    │   (Gemini Vision)    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Condition Score?    │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────────┐
          │                    │                        │
    ┌─────▼─────┐      ┌──────▼──────┐         ┌──────▼──────┐
    │  8-10/10  │      │   4-7.9/10  │         │   0-3.9/10  │
    │ Excellent │      │    Fair      │         │    Poor     │
    └─────┬─────┘      └──────┬──────┘         └──────┬──────┘
          │                    │                        │
          ▼                    │                        │
┌───────────────────┐          │                        │
│ Resell as         │    ┌─────┼─────┐           ┌─────┼─────┐
│ Certified         │    │           │           │           │
│ Refurbished       │    ▼           ▼           ▼           ▼
│                   │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ +50 credits 🌱   │ │ P2P    │ │Refurb  │ │ Donate │ │Recycle │
│ CO₂: 1.2kg saved │ │Resale  │ │ then   │ │        │ │        │
└───────────────────┘ │        │ │ Resell │ │+75 🌱  │ │+30 🌱  │
                      │+60 🌱  │ │+40 🌱  │ │CO₂:1.5 │ │CO₂:0.4 │
                      │CO₂:1.3 │ │CO₂:0.9 │ └────────┘ └────────┘
                      └────────┘ └────────┘

                               │
                               ▼
                    ┌─────────────────────┐
                    │  Product Gets a     │
                    │  Meaningful          │
                    │  Second Life ♻️      │
                    └─────────────────────┘
```

---

## Data Models (MongoDB Schema Relationships)

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA MODELS                               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    User      │         │    Shop      │         │   Product    │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ _id          │◄────┐   │ _id          │◄────┐   │ _id          │
│ name         │     │   │ name         │     │   │ name         │
│ email        │     │   │ email        │     │   │ description  │
│ password     │     │   │ password     │     │   │ category     │
│ phoneNumber  │     │   │ address      │     │   │ originalPrice│
│ addresses[]  │     │   │ phoneNumber  │     │   │ discountPrice│
│ role         │     │   │ role         │     │   │ stock        │
│ avatar       │     │   │ avatar       │     │   │ images[]     │
│ greenCredits │     │   │ zipCode      │     │   │ reviews[]    │
│              │     │   │ balance      │     │   │ ratings      │
└──────────────┘     │   │ transections │     └───│ shopId       │
       │             │   └──────────────┘         │ shop         │
       │             │                            │ sold_out     │
       │             │                            └──────────────┘
       │             │                                   │
       │             │                                   │
       ▼             │                                   ▼
┌──────────────┐     │                     ┌──────────────────────┐
│    Order     │     │                     │      Return ⭐ NEW   │
├──────────────┤     │                     ├──────────────────────┤
│ _id          │     │                     │ _id                  │
│ cart[]       │     │                     │ userId ──────────────┼──► User
│ shippingAddr │     │                     │ orderId ─────────────┼──► Order
│ user ────────┼─────┘                     │ productName          │
│ totalPrice   │                           │ productCategory      │
│ status       │                           │ returnReason         │
│ paymentInfo  │                           │ images[]             │
│ paidAt       │                           │ aiGrading:           │
│ deliveredAt  │                           │   • conditionScore   │
└──────────────┘                           │   • trustScore       │
                                           │   • aiConfidence     │
┌──────────────┐                           │   • defects[]        │
│ Conversation │                           │   • decision         │
├──────────────┤                           │   • suggestedPrice   │
│ _id          │                           │   • reasoning        │
│ members[]    │                           │ greenCreditsEarned   │
│ lastMessage  │                           │ co2Saved             │
│ lastMessageId│                           │ status               │
└──────┬───────┘                           │ healthCard:          │
       │                                   │   • generatedAt      │
       ▼                                   │   • verifiedBy       │
┌──────────────┐                           └──────────────────────┘
│   Message    │
├──────────────┤
│ _id          │
│ conversationId
│ text         │
│ sender       │
│ images[]     │
└──────────────┘
```

---

## Frontend Component Tree

```
App.js
├── BrowserRouter
│   ├── PUBLIC ROUTES
│   │   ├── / ─────────────────── HomePage
│   │   │                         ├── Header (Navbar + Search + Cart)
│   │   │                         ├── Hero Banner
│   │   │                         ├── GreenImpactStats ⭐ (ReLife)
│   │   │                         ├── HowItWorks ⭐ (ReLife)
│   │   │                         ├── TrustBanner ⭐ (ReLife)
│   │   │                         ├── Categories
│   │   │                         ├── BestDeals
│   │   │                         ├── FeaturedProducts
│   │   │                         └── Footer
│   │   │
│   │   ├── /products ─────────── ProductsPage
│   │   ├── /product/:id ──────── ProductDetailsPage
│   │   ├── /best-selling ─────── BestSellingPage
│   │   ├── /events ───────────── EventsPage
│   │   ├── /faq ──────────────── FAQPage
│   │   ├── /login ────────────── LoginPage
│   │   ├── /sign-up ──────────── SignupPage
│   │   │
│   │   ├── /refurbished ──────── RefurbishedPage ⭐ (Second Life)
│   │   ├── /return-portal ────── ReturnPortalPage ⭐ (AI Grading)
│   │   └── /green-credits ────── GreenCreditsPage ⭐ (Sustainability)
│   │
│   ├── PROTECTED ROUTES (User)
│   │   ├── /profile ──────────── ProfilePage
│   │   ├── /checkout ─────────── CheckoutPage
│   │   ├── /payment ──────────── PaymentPage (Stripe Elements)
│   │   ├── /order/success ────── OrderSuccessPage
│   │   ├── /user/order/:id ───── OrderDetailsPage
│   │   ├── /user/track/:id ───── TrackOrderPage
│   │   └── /inbox ────────────── UserInbox
│   │
│   ├── SELLER ROUTES (Shop)
│   │   ├── /dashboard ────────── ShopDashboardPage
│   │   ├── /dashboard-create ─── ShopCreateProduct
│   │   ├── /dashboard-products ─ ShopAllProducts
│   │   ├── /dashboard-orders ─── ShopAllOrders
│   │   ├── /dashboard-refunds ── ShopAllRefunds
│   │   ├── /dashboard-events ─── ShopAllEvents
│   │   ├── /dashboard-coupons ── ShopAllCoupons
│   │   ├── /dashboard-messages ─ ShopInboxPage
│   │   ├── /dashboard-withdraw ─ ShopWithDrawMoneyPage
│   │   └── /settings ─────────── ShopSettingsPage
│   │
│   └── ADMIN ROUTES
│       ├── /admin/dashboard ───── AdminDashboardPage
│       ├── /admin-users ──────── AdminDashboardUsers
│       ├── /admin-sellers ────── AdminDashboardSellers
│       ├── /admin-orders ─────── AdminDashboardOrders
│       ├── /admin-products ───── AdminDashboardProducts
│       ├── /admin-events ─────── AdminDashboardEvents
│       └── /admin-withdraw ───── AdminDashboardWithdraw
│
└── ToastContainer (Notifications)
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        TECH STACK                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FRONTEND                    │  BACKEND                          │
│  ─────────                   │  ────────                         │
│  • React 18                  │  • Node.js + Express              │
│  • Redux Toolkit             │  • Mongoose (MongoDB ODM)         │
│  • React Router v6           │  • JWT Authentication             │
│  • Tailwind CSS              │  • Multer (File Upload)           │
│  • Material UI v4            │  • bcryptjs (Password Hash)       │
│  • Axios (HTTP Client)       │  • Cookie-Parser                  │
│  • Socket.io-client          │  • Nodemailer (Email)             │
│  • Stripe React              │  • @google/generative-ai ⭐       │
│  • React Toastify            │  • Stripe SDK                     │
│  • React Icons               │  • CORS                           │
│  • react-lottie              │  • body-parser                    │
│                              │                                   │
│  DATABASE                    │  REAL-TIME                        │
│  ─────────                   │  ──────────                       │
│  • MongoDB Atlas             │  • Socket.io Server               │
│  • Cloud-hosted              │  • Express (port 4000)            │
│                              │  • Bi-directional messaging       │
│                              │                                   │
│  AI / EXTERNAL               │  PAYMENTS                         │
│  ────────────                │  ─────────                        │
│  • Google Gemini 2.0 Flash   │  • Stripe                         │
│  • Vision (Image Analysis)   │  • PayPal (react-paypal-js)       │
│  • Text Generation           │                                   │
│                              │                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Roles & Access Matrix

```
┌────────────────────┬───────────┬───────────┬───────────┐
│     Feature        │   User    │  Seller   │   Admin   │
├────────────────────┼───────────┼───────────┼───────────┤
│ Browse Products    │    ✅     │    ✅     │    ✅     │
│ Purchase / Cart    │    ✅     │    ❌     │    ❌     │
│ Return Portal (AI) │    ✅     │    ❌     │    ✅     │
│ Green Credits      │    ✅     │    ❌     │    ✅     │
│ Refurbished Shop   │    ✅     │    ✅     │    ✅     │
│ Messaging          │    ✅     │    ✅     │    ❌     │
│ Create Products    │    ❌     │    ✅     │    ❌     │
│ Manage Orders      │    ❌     │    ✅     │    ✅     │
│ Create Events      │    ❌     │    ✅     │    ❌     │
│ Coupons            │    ❌     │    ✅     │    ❌     │
│ Withdraw Money     │    ❌     │    ✅     │    ❌     │
│ Admin Dashboard    │    ❌     │    ❌     │    ✅     │
│ Manage Users       │    ❌     │    ❌     │    ✅     │
│ Approve Withdraws  │    ❌     │    ❌     │    ✅     │
└────────────────────┴───────────┴───────────┴───────────┘
```

---

## Deployment Architecture (Production)

```
                         ┌──────────────┐
                         │   Internet   │
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │   CDN /      │
                         │  Cloudflare  │
                         └──────┬───────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
       ┌──────▼───────┐ ┌──────▼───────┐ ┌──────▼───────┐
       │   Frontend   │ │   Backend    │ │   Socket     │
       │   (Vercel/   │ │   (Render/   │ │   (Render/   │
       │   Netlify)   │ │   Railway)   │ │   Railway)   │
       │              │ │              │ │              │
       │   React SPA  │ │  Node.js API │ │  Socket.io   │
       │   Port 3000  │ │  Port 8000   │ │  Port 4000   │
       └──────────────┘ └──────┬───────┘ └──────────────┘
                               │
                        ┌──────▼───────┐
                        │  MongoDB     │
                        │  Atlas       │
                        │  (Cloud DB)  │
                        └──────────────┘
                               │
                        ┌──────▼───────┐
                        │  File Store  │
                        │  (S3/Local)  │
                        │  /uploads    │
                        └──────────────┘
```

---

## Second Life Commerce — Complete Product Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PRODUCT LIFECYCLE IN SECOND LIFE                          │
└─────────────────────────────────────────────────────────────────────────────┘

  ① BUY              ② USE             ③ RETURN           ④ AI GRADES
  ════════           ════════           ════════           ════════════
  User browses  →   User receives  →   User initiates →  AI analyzes
  products           product            return             condition
  Adds to cart       Uses it            Uploads photos     Generates
  Pays (Stripe)      Maybe doesn't      Selects reason     Health Card
                     need it                               Scores: 7.8/10

                                                                │
                                                                ▼
  ⑧ IMPACT           ⑦ REWARDS          ⑥ SECOND LIFE     ⑤ ROUTING
  ════════           ════════           ════════════       ════════
  CO₂ saved      ←  Green Credits  ←   Product gets   ←  AI decides:
  tracked            awarded            new owner          • Resell ♻️
  Sustainability     +50 🌱             Listed in          • Refurbish 🔧
  stats update       Redeemable         marketplace        • Donate 🎁
                     for discounts      Buyer trusts       • Recycle ♳
                                        Health Card        • P2P 🤝
```
