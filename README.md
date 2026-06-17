# 🛒 Amazon Second Life Commerce — AI-Powered Sustainable Returns & Resale

> **HackOn with Amazon Season 6.0** | Theme: Second Life Commerce: AI-Powered Returns & Sustainable Resale

## 🎯 Problem Statement

Millions of products bought online are returned, underused, or discarded despite being perfectly usable. Returns are expensive for customers, sellers, and the planet. Customers also struggle to trust refurbished or second-hand products.

**Our Solution:** An AI-powered intelligent bridge for sustainable commerce — where returned or unused products automatically find their next best owner within Amazon's trusted ecosystem.

---

## 🚀 Live Features (Completed)

### ✅ Frontend — Amazon Orange Theme
- [x] Amazon-branded dark theme (`#131921` header, `#ff9900` orange accents)
- [x] Hero section: "Every Product Deserves a Second Life" with impact stats
- [x] Green Impact Stats strip (products saved, CO₂ avoided, revenue recovered)
- [x] "How Amazon Second Life Works" — 4-step visual flow
- [x] AI Trust Scores banner with mock Health Card preview
- [x] **Refurbished Marketplace** (`/refurbished`) — certified products with condition scores
- [x] **AI Return Portal** (`/return-portal`) — upload images → AI grades → routing decision
- [x] **Green Credits Dashboard** (`/green-credits`) — balance, history, earning guide
- [x] Updated navigation: Home | Products | Refurbished ♻️ | Return Portal | Green Credits 🌱 | FAQ
- [x] Amazon-styled footer with Second Life features

### ✅ Backend — Node.js + Express + MongoDB
- [x] MongoDB Atlas connected (shared cloud DB for team)
- [x] Existing e-commerce backend (auth, products, orders, cart, payments)
- [x] Existing return/refund flow (to be enhanced with AI)

---

## 🔨 TODO — Features to Build

### Backend AI Integration (Priority)
- [ ] **AI Service Layer** — Gemini API integration (provider-agnostic)
- [ ] `POST /api/v2/relife/grade` — Image upload → AI condition grading
- [ ] `POST /api/v2/relife/route` — Smart routing (resell/refurbish/donate/recycle/exchange)
- [ ] `GET /api/v2/relife/health-card/:id` — Generate AI product health card
- [ ] `GET /api/v2/relife/recommend/:userId` — Personalized refurbished recommendations
- [ ] `POST /api/v2/relife/predict` — Return risk prediction at checkout
- [ ] `POST /api/v2/relife/credits/earn` — Award green credits
- [ ] `GET /api/v2/relife/dashboard` — Sustainability metrics

### New MongoDB Models
- [ ] `QualityGrade` — AI grading results (score, defects, confidence)
- [ ] `HealthCard` — Product digital passport
- [ ] `RoutingDecision` — Smart routing output + reasoning
- [ ] `GreenCredit` — Credits ledger (earned/spent)
- [ ] `ReturnPrediction` — Risk scores per checkout
- [ ] `SustainabilityMetric` — Aggregated impact data

### Frontend Enhancements
- [ ] Connect Return Portal to real AI backend (currently mock)
- [ ] Connect Refurbished page to actual DB products
- [ ] Connect Green Credits to user's real balance
- [ ] Add "Certified Refurbished" badge on product cards
- [ ] Add AI Health Card tab on product details page
- [ ] Add Return Prediction warning at checkout
- [ ] Admin sustainability dashboard
- [ ] Dynamic pricing display from AI

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Frontend (React + Redux + Tailwind)          │
│  Existing E-commerce + New ReLife Pages                   │
└────────────────────────┬────────────────────────────────┘
                         │ REST API
┌────────────────────────▼────────────────────────────────┐
│              Backend (Express + Node.js)                  │
│  Existing Routes + /api/v2/relife/* (AI routes)          │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ AI Service Layer (Abstracted)                        │ │
│  │  ├── Gemini API (primary — free, text + vision)     │ │
│  │  ├── Groq API (fallback — free, fast)               │ │
│  │  └── Ollama (local development)                     │ │
│  └─────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              MongoDB Atlas (Free Tier)                    │
│  Existing: users, products, orders, shops                │
│  New: qualityGrades, healthCards, routingDecisions,      │
│       greenCredits, returnPredictions, metrics           │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux, Tailwind CSS, Material UI |
| Backend | Node.js, Express.js, JWT Auth |
| Database | MongoDB Atlas (free tier) |
| AI | Google Gemini API (free), Groq API (fallback) |
| Real-time | Socket.io |
| Payments | Stripe, PayPal, COD |

---

## 📦 Setup & Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Gemini API key (free from https://aistudio.google.com/apikey)

### 1. Clone
```bash
git clone https://github.com/surendiran04/Amazon-commerce.git
cd Amazon-commerce
```

### 2. Backend Setup
```bash
cd backend
npm install
mkdir -p config uploads
```

Create `backend/config/.env`:
```env
PORT = 8000
DB_URL = "your-mongodb-atlas-url"
JWT_SECRET_KEY = "your-secret-key"
JWT_EXPIRES = 7d
ACTIVATION_SECRET = "your-activation-secret"
SMPT_HOST = "smtp.gmail.com"
SMPT_PORT = 465
SMPT_PASSWORD = ""
SMPT_MAIL = ""
STRIPE_API_KEY = ""
STRIPE_SECRET_KEY = ""
GEMINI_API_KEY = ""
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

### 4. Socket (Optional — for chat)
```bash
cd socket
npm install
npm start
```

### Access
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## 📊 Feature Coverage (Against Problem Statement)

| Requirement | Status | Feature |
|-------------|--------|---------|
| ✅ AI deciding resell/refurbish/donate/recycle/exchange | 🔨 Building | Smart Routing Engine |
| ✅ Smart quality grading through image/video analysis | 🔨 Building | AI Product Grading |
| ✅ Personalized recommendations for refurbished products | 🔨 Building | Recommendation Engine |
| ✅ Sustainable incentives and "green credits" | ✅ UI Done | Green Credits System |
| ✅ Easy peer-to-peer resale in Amazon ecosystem | 📋 Planned | P2P Marketplace |
| ✅ Predictive return prevention before purchase | 🔨 Building | Return Predictor |
| ✅ Customer trust via verified health cards | ✅ UI Done | AI Health Cards |
| ✅ Sustainability tracking | ✅ UI Done | Carbon Dashboard |
| ✅ Dynamic pricing | 📋 Planned | Pricing Engine |

**Coverage: 100% of official problem statement addressed**

---


## 📄 License

Built for HackOn with Amazon Season 6.0 — 48hr Hackathon Challenge
