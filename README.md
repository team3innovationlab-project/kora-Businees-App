# KORA - Modern Retail Operating System & POS Platform

> **KORA is the modern retail operating system that connects POS, payments, inventory, expenses, reconciliation, staff, and automated business reporting in one platform.**

Built for retail storefronts, boutiques, supermarkets, and electronics shops across West Africa (with Paystack, MTN Mobile Money, Telecel Cash, AT Money, and Visa/Mastercard integration).

---

## 🌟 Key Features

1. **Fast Checkout POS Terminal**
   - Barcode & catalog lookup, real-time inventory deduction.
   - Accepts Cash, MTN MoMo, Telecel Cash, AT Money, and Visa/Mastercard.
   - Auto-generated customer receipts with QR verification.

2. **Automated WhatsApp Daily Close Reports**
   - Dispatches a comprehensive end-of-day financial close report directly to the shop owner's WhatsApp every evening.
   - Summarizes total sales, cash collected, Mobile Money settlements, card settlements, expenses, register variance, and net cash flow.

3. **Cash Leakage Shield & Variance Reconciliation**
   - End-of-day register balancing between actual physical cash counted and expected system cash.
   - Instant variance tracking to eliminate shrinkage and protect store revenue.

4. **Real-Time Stock & Restock Alerts**
   - Inventory tracking with low-stock warnings before items sell out.

5. **Expense Tracking & Cash Ledgers**
   - Record petty cash, supplier payments, utilities, and daily operations expenses.

6. **Staff Management & Shifts**
   - Multi-user cashier accounts with role-based access control.

7. **36 Ghana & World Holiday Promotions**
   - Pre-programmed statutory and retail holiday campaigns (Independence Day, Easter, Farmers' Day, Black Friday, Christmas) with 1-click WhatsApp customer broadcasts.

8. **Multi-Tenant & Self-Hostable**
   - Deploy as a multi-store platform on your own Linux VPS with Docker, PM2, and Nginx.

---

## 📂 Project Structure

```text
├── index.html                   # HTML entry point with KORA SEO & OpenGraph tags
├── package.json                 # Dependencies and build scripts
├── server.ts                    # Node.js Express backend API & static asset proxy
├── server.js                    # Bundled production server (generated via esbuild)
├── Dockerfile                   # Multi-stage production container build
├── docker-compose.yml           # Docker Compose setup for VPS deployment
├── deploy-vps.sh                # 1-click automated VPS installation script
├── DEPLOYMENT_GUIDE.md          # Step-by-step production hosting manual
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx      # ⭐ KORA Landing Page (matching design mockup)
│   │   ├── Header.tsx           # POS Navigation header & store switcher
│   │   ├── Navigation.tsx       # Primary module tab navigation
│   │   ├── DashboardOverview.tsx# Real-time metrics, KPI cards & revenue charts
│   │   ├── SalesTab.tsx         # Transaction history & receipts
│   │   ├── RecordSaleModal.tsx  # Quick POS checkout modal
│   │   ├── StockTab.tsx         # Inventory management
│   │   ├── ExpensesTab.tsx      # Operational expense ledger
│   │   ├── ReconciliationTab.tsx# Daily register cash balancing
│   │   ├── StaffTab.tsx         # Cashier & manager team accounts
│   │   ├── AlertsTab.tsx        # Low-stock & variance notifications
│   │   ├── CustomersPromoTab.tsx# 36 Holiday promo broadcasts & CRM
│   │   ├── WhatsAppModal.tsx    # Automated WhatsApp report generator
│   │   ├── BusinessLoginPage.tsx# Secure login portal
│   │   └── OnboardingPage.tsx   # New store setup wizard
│   ├── assets/images/           # High-resolution generated photography & products
│   ├── types.ts                 # Full TypeScript schemas
│   └── App.tsx                  # Main router & state coordinator
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The landing page will load by default.

### 3. Production Build
```bash
npm run build
```
This builds both the frontend Vite bundle into `dist/` and the backend `server.js` using esbuild.

### 4. Start Production Server
```bash
npm start
```

---

## 🌐 Finding the Landing Page

The landing page component is located at:
- **`src/components/LandingPage.tsx`**

When the application loads, `src/App.tsx` routes the user to the landing page (`currentView === 'landing'`). Users can:
- Click **"Start 14-Day Free Trial"** or **"Get Started Free"** to onboard a new store.
- Click **"Explore Live POS Demo"** or **`pos.kora.app · Live Store Instance`** to open the live store terminal directly.
- Click **"Sign in"** to access the cashier/owner login portal.
- Click **"Pricing"** to view Starter, Business Pro, and Enterprise subscription tiers.

---

## 🐳 Self-Hosting & VPS Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for full instructions on running KORA on any Ubuntu/Debian VPS using Docker or PM2.

```bash
# Quick Docker Compose deployment
docker compose up -d --build
```
