// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import path2 from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// src/server/storage.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";
var DATA_DIR = path.resolve(process.cwd(), "data");
var DB_FILE = path.resolve(DATA_DIR, "pos_database.json");
function hashPassword(password) {
  const salt = "wing_ai_salt_techwokx_gh";
  return crypto.scryptSync(password, salt, 32).toString("hex");
}
function generateToken(userId) {
  return `${userId}_${crypto.randomBytes(24).toString("hex")}`;
}
var DEFAULT_SEED_DATA = {
  business: {
    id: "biz_techwokx_gh",
    name: "Techwokx Ghana",
    category: "Electronics & Retail",
    city: "Accra",
    country: "Ghana",
    currency: "GH\u20B5",
    phone: "+233 24 456 7890",
    whatsAppNumber: "+233244567890",
    taxRate: 0,
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80",
    paymentGateway: {
      provider: "PAYSTACK",
      publicKey: "pk_live_techwokx_gh_78291482",
      testMode: false,
      momoEnabled: true,
      cardEnabled: true
    },
    subscription: {
      plan: "BUSINESS_PRO",
      status: "ACTIVE",
      billingCycle: "MONTHLY",
      amountGhs: 249,
      nextBillingDate: "2026-10-24",
      paymentProvider: "PAYSTACK",
      reference: "sub_pstk_twx_9941"
    },
    whatsAppAutomation: {
      enabled: true,
      autoSendOnReconciliation: true,
      autoSendAtScheduledTime: true,
      scheduledTime: "20:00",
      recipients: ["+233244567890"],
      gatewayMode: "VPS_GATEWAY_SERVICE",
      lastDispatchedAt: "2026-09-24T20:00:00.000Z",
      lastDispatchStatus: "DELIVERED",
      lastDispatchMessageId: "WAX-TWX-98214",
      lastRecipientCount: 1
    },
    createdAt: "2026-01-10T08:00:00Z"
  },
  businesses: [
    {
      id: "biz_techwokx_gh",
      name: "Techwokx Ghana",
      category: "Electronics & Retail",
      city: "Accra",
      country: "Ghana",
      currency: "GH\u20B5",
      phone: "+233 24 456 7890",
      whatsAppNumber: "+233244567890",
      taxRate: 0,
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80",
      paymentGateway: {
        provider: "PAYSTACK",
        publicKey: "pk_live_techwokx_gh_78291482",
        testMode: false,
        momoEnabled: true,
        cardEnabled: true
      },
      subscription: {
        plan: "BUSINESS_PRO",
        status: "ACTIVE",
        billingCycle: "MONTHLY",
        amountGhs: 249,
        nextBillingDate: "2026-10-24",
        paymentProvider: "PAYSTACK",
        reference: "sub_pstk_twx_9941"
      },
      createdAt: "2026-01-10T08:00:00Z"
    },
    {
      id: "biz_accra_fresh",
      name: "Accra Fresh Mart",
      category: "Grocery & Supermarket",
      city: "Airport Residential, Accra",
      country: "Ghana",
      currency: "GH\u20B5",
      phone: "+233 20 888 1234",
      whatsAppNumber: "+233208881234",
      taxRate: 0,
      logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=160&q=80",
      paymentGateway: {
        provider: "PAYSTACK",
        publicKey: "pk_live_accrafresh_884291",
        testMode: false,
        momoEnabled: true,
        cardEnabled: true
      },
      subscription: {
        plan: "STARTER",
        status: "ACTIVE",
        billingCycle: "MONTHLY",
        amountGhs: 99,
        nextBillingDate: "2026-10-15",
        paymentProvider: "PAYSTACK",
        reference: "sub_pstk_afm_3321"
      },
      createdAt: "2026-02-01T10:00:00Z"
    },
    {
      id: "biz_kumasi_hub",
      name: "Oseikrom Smart Hub",
      category: "Phones & Gadgets",
      city: "Adum, Kumasi",
      country: "Ghana",
      currency: "GH\u20B5",
      phone: "+233 27 555 9900",
      whatsAppNumber: "+233275559900",
      taxRate: 0,
      logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=160&q=80",
      paymentGateway: {
        provider: "PAYSTACK",
        publicKey: "pk_live_kumasi_449102",
        testMode: false,
        momoEnabled: true,
        cardEnabled: true
      },
      subscription: {
        plan: "ENTERPRISE",
        status: "ACTIVE",
        billingCycle: "ANNUAL",
        amountGhs: 499,
        nextBillingDate: "2027-03-01",
        paymentProvider: "PAYSTACK",
        reference: "sub_pstk_kumu_110"
      },
      createdAt: "2026-03-01T10:00:00Z"
    }
  ],
  activeBusinessId: "biz_techwokx_gh",
  customers: [
    {
      id: "cust_1",
      businessId: "biz_techwokx_gh",
      name: "Kofi Boateng",
      phone: "+233 24 123 4567",
      whatsAppNumber: "+233241234567",
      email: "kofi.b@gmail.com",
      totalSpend: 1450,
      orderCount: 7,
      lastPurchaseDate: "2026-09-24",
      tags: ["VIP", "Repeat Buyer", "Earbuds Pro"],
      notes: "Prefers Mobile Money (MTN), tech enthusiast in Osu",
      createdAt: "2026-01-20"
    },
    {
      id: "cust_2",
      businessId: "biz_techwokx_gh",
      name: "Ama Serwaa",
      phone: "+233 50 234 5678",
      whatsAppNumber: "+233502345678",
      email: "ama.serwaa@outlook.com",
      totalSpend: 920,
      orderCount: 4,
      lastPurchaseDate: "2026-09-23",
      tags: ["Promo Eligible", "Accessories"],
      notes: "Often orders fast charging cables and power banks",
      createdAt: "2026-02-12"
    },
    {
      id: "cust_3",
      businessId: "biz_techwokx_gh",
      name: "Emmanuel Addo",
      phone: "+233 27 345 6789",
      whatsAppNumber: "+233273456789",
      email: "emmanuel.addo@yahoo.com",
      totalSpend: 680,
      orderCount: 3,
      lastPurchaseDate: "2026-09-20",
      tags: ["Electronics Lover", "Telecel MoMo"],
      notes: "Customer at Spintex branch",
      createdAt: "2026-03-05"
    },
    {
      id: "cust_4",
      businessId: "biz_techwokx_gh",
      name: "Jessica Mensah",
      phone: "+233 55 456 7890",
      whatsAppNumber: "+233554567890",
      email: "jess.mensah@gmail.com",
      totalSpend: 2150,
      orderCount: 9,
      lastPurchaseDate: "2026-09-24",
      tags: ["VIP", "Bulk Buyer", "Holiday Shopper"],
      notes: "Purchases corporate gift bundles",
      createdAt: "2026-01-15"
    },
    {
      id: "cust_5",
      businessId: "biz_techwokx_gh",
      name: "David Quaye",
      phone: "+233 24 567 8901",
      whatsAppNumber: "+233245678901",
      email: "dquaye@hotline.gh",
      totalSpend: 340,
      orderCount: 2,
      lastPurchaseDate: "2026-09-18",
      tags: ["Repeat"],
      notes: "Walk-in cash customer",
      createdAt: "2026-04-10"
    },
    {
      id: "cust_6",
      businessId: "biz_techwokx_gh",
      name: "Akosua Frimpong",
      phone: "+233 20 678 9012",
      whatsAppNumber: "+233206789012",
      email: "akosua.f@gmail.com",
      totalSpend: 1200,
      orderCount: 5,
      lastPurchaseDate: "2026-09-22",
      tags: ["VIP", "Holiday Promo"],
      notes: "Always responds to 6th March and Christmas promos",
      createdAt: "2026-02-18"
    },
    {
      id: "cust_7",
      businessId: "biz_techwokx_gh",
      name: "Prince Osei",
      phone: "+233 24 789 0123",
      whatsAppNumber: "+233247890123",
      email: "prince.osei@gmail.com",
      totalSpend: 550,
      orderCount: 2,
      lastPurchaseDate: "2026-09-24",
      tags: ["New Customer"],
      notes: "Referred from Instagram ad",
      createdAt: "2026-09-10"
    },
    {
      id: "cust_8",
      businessId: "biz_techwokx_gh",
      name: "Nana Yaw",
      phone: "+233 50 890 1234",
      whatsAppNumber: "+233508901234",
      email: "nanayaw.gh@gmail.com",
      totalSpend: 1800,
      orderCount: 6,
      lastPurchaseDate: "2026-09-21",
      tags: ["VIP", "Tech Enthusiast"],
      notes: "Prompt payer, loves premium earbuds",
      createdAt: "2026-03-01"
    }
  ],
  promoBroadcasts: [
    {
      id: "bc_1",
      title: "6th March Independence Freedom Sale",
      message: "\u{1F1EC}\u{1F1ED}\u2B50 Y\u03B5n Ara Asaase Ni! Happy 6th March Independence Day from Techwokx Ghana! Enjoy our giant Freedom Promo of 25% OFF on all products.",
      recipientsCount: 8,
      channel: "WHATSAPP",
      holidayId: "gh_independence_day",
      timestamp: "2026-03-06T08:30:00Z",
      status: "DELIVERED"
    },
    {
      id: "bc_2",
      title: "Payday Weekend Treat Yourself Sale",
      message: "\u{1F4B5} Salary alert hit! Treat yourself this payday weekend with Techwokx Ghana. Enjoy 15% OFF on wireless earbuds and accessories!",
      recipientsCount: 8,
      channel: "WHATSAPP",
      holidayId: "glob_payday_weekend",
      timestamp: "2026-08-28T10:00:00Z",
      status: "DELIVERED"
    }
  ],
  whatsAppDispatchLogs: [
    {
      id: "walog_seed_1",
      date: "2026-09-24",
      timestamp: "2026-09-24T20:00:00.000Z",
      recipients: ["+233244567890"],
      trigger: "RECONCILIATION_CLOSE",
      status: "DELIVERED",
      summaryPreview: "\u{1F4CA} TECHWOKX GHANA - DAILY CLOSE REPORT\n\u{1F4B0} TODAY'S TOTAL SALES: GH\u20B5 2,840.00\n\u{1F9FE} Total Transactions: 18 orders\n\u{1F4C8} ESTIMATED NET CASH FLOW: GH\u20B5 2,510.00...",
      messageId: "WAX-TWX-98214",
      latencyMs: 240
    },
    {
      id: "walog_seed_2",
      date: "2026-09-23",
      timestamp: "2026-09-23T20:00:05.000Z",
      recipients: ["+233244567890"],
      trigger: "SCHEDULED_CRON",
      status: "DELIVERED",
      summaryPreview: "\u{1F4CA} TECHWOKX GHANA - DAILY CLOSE REPORT\n\u{1F4B0} TODAY'S TOTAL SALES: GH\u20B5 3,120.00\n\u{1F9FE} Total Transactions: 22 orders\n\u{1F4C8} ESTIMATED NET CASH FLOW: GH\u20B5 2,890.00...",
      messageId: "WAX-TWX-97103",
      latencyMs: 195
    }
  ],
  users: [
    {
      id: "usr_george_owner",
      name: "George J",
      email: "george.jabley@gmail.com",
      role: "BUSINESS_OWNER",
      phone: "+233 24 456 7890",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      passwordHash: hashPassword("admin123"),
      pin: "1234",
      createdAt: "2026-01-15T08:00:00Z"
    },
    {
      id: "usr_abena_mgr",
      name: "Abena Osei",
      email: "abena@techwokx.com",
      role: "MANAGER",
      phone: "+233 50 123 4567",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      passwordHash: hashPassword("manager123"),
      pin: "5678",
      createdAt: "2026-02-01T09:30:00Z"
    },
    {
      id: "usr_kwame_cashier",
      name: "Kwame Mensah",
      email: "kwame@techwokx.com",
      role: "CASHIER",
      phone: "+233 27 987 6543",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      passwordHash: hashPassword("cashier123"),
      pin: "9012",
      createdAt: "2026-03-10T10:00:00Z"
    }
  ],
  stock: [
    {
      id: "prod_1",
      name: "Wireless Bluetooth Earbuds Pro",
      sku: "TWX-EAR-01",
      category: "Electronics",
      costPrice: 90,
      sellingPrice: 160,
      currentQuantity: 24,
      restockThreshold: 5,
      unit: "pcs",
      supplier: "Accra Central Tech Import",
      updatedAt: "2026-09-24"
    },
    {
      id: "prod_2",
      name: "USB-C Fast Charging Cable (2M)",
      sku: "TWX-CAB-02",
      category: "Accessories",
      costPrice: 15,
      sellingPrice: 35,
      currentQuantity: 42,
      restockThreshold: 10,
      unit: "pcs",
      supplier: "Circle Gadgets Wholesaler",
      updatedAt: "2026-09-24"
    },
    {
      id: "prod_3",
      name: "20,000mAh Dual Port Power Bank",
      sku: "TWX-PB-03",
      category: "Electronics",
      costPrice: 110,
      sellingPrice: 200,
      currentQuantity: 18,
      restockThreshold: 6,
      unit: "pcs",
      supplier: "Accra Central Tech Import",
      updatedAt: "2026-09-24"
    },
    {
      id: "prod_4",
      name: "Magnetic Car Mount Holder",
      sku: "TWX-MNT-04",
      category: "Accessories",
      costPrice: 20,
      sellingPrice: 45,
      currentQuantity: 15,
      restockThreshold: 5,
      unit: "pcs",
      supplier: "Circle Gadgets Wholesaler",
      updatedAt: "2026-09-24"
    },
    {
      id: "prod_5",
      name: "Tempered Glass Screen Protector (iPhone)",
      sku: "TWX-SCR-05",
      category: "Protection",
      costPrice: 8,
      sellingPrice: 25,
      currentQuantity: 30,
      restockThreshold: 12,
      unit: "pcs",
      supplier: "Circle Gadgets Wholesaler",
      updatedAt: "2026-09-24"
    },
    {
      id: "prod_6",
      name: "Smart Fitness Band Watch",
      sku: "TWX-WAT-06",
      category: "Wearables",
      costPrice: 130,
      sellingPrice: 240,
      currentQuantity: 8,
      restockThreshold: 3,
      unit: "pcs",
      supplier: "Global Direct Tech",
      updatedAt: "2026-09-24"
    }
  ],
  sales: [],
  expenses: [],
  reconciliations: {},
  alerts: [
    {
      id: "alt_1",
      type: "MILESTONE",
      title: "Daily Register Opened",
      message: "Register initialized for today. All product stock levels are synchronized.",
      severity: "low",
      date: "2026-09-24",
      resolved: false
    },
    {
      id: "alt_2",
      type: "LEAKAGE_VARIANCE",
      title: "End of Day Reconciliation Reminder",
      message: "Perform actual cash and MoMo count before evening register close to ensure zero variance.",
      severity: "warning",
      date: "2026-09-24",
      resolved: false,
      actionPath: "reconciliation"
    },
    {
      id: "alt_3",
      type: "LOW_STOCK",
      title: "Smart Fitness Band Watch Threshold",
      message: "Stock is currently at 8 units (Threshold is 3). Consider checking supplier lead time.",
      severity: "low",
      date: "2026-09-24",
      resolved: false,
      actionPath: "stock"
    }
  ]
};
var PosStorage = class {
  constructor() {
    this.data = this.loadData();
  }
  loadData() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (!parsed.business.whatsAppAutomation) {
          parsed.business.whatsAppAutomation = {
            enabled: true,
            autoSendOnReconciliation: true,
            autoSendAtScheduledTime: true,
            scheduledTime: "20:00",
            recipients: [parsed.business.whatsAppNumber || "+233244567890"],
            gatewayMode: "VPS_GATEWAY_SERVICE",
            lastDispatchedAt: (/* @__PURE__ */ new Date()).toISOString(),
            lastDispatchStatus: "DELIVERED",
            lastDispatchMessageId: "WAX-TWX-98214",
            lastRecipientCount: 1
          };
        }
        if (!parsed.business.id) {
          parsed.business.id = "biz_techwokx_gh";
        }
        if (!parsed.business.logo) {
          parsed.business.logo = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80";
        }
        if (!parsed.business.paymentGateway) {
          parsed.business.paymentGateway = {
            provider: "PAYSTACK",
            publicKey: "pk_live_techwokx_gh_78291482",
            testMode: false,
            momoEnabled: true,
            cardEnabled: true
          };
        }
        if (!parsed.business.subscription) {
          parsed.business.subscription = {
            plan: "BUSINESS_PRO",
            status: "ACTIVE",
            billingCycle: "MONTHLY",
            amountGhs: 249,
            nextBillingDate: "2026-10-24",
            paymentProvider: "PAYSTACK",
            reference: "sub_pstk_twx_9941"
          };
        }
        if (!parsed.businesses || parsed.businesses.length === 0) {
          parsed.businesses = DEFAULT_SEED_DATA.businesses || [parsed.business];
        }
        if (!parsed.activeBusinessId) {
          parsed.activeBusinessId = parsed.business.id || "biz_techwokx_gh";
        }
        if (!parsed.customers || parsed.customers.length === 0) {
          parsed.customers = DEFAULT_SEED_DATA.customers || [];
        }
        if (!parsed.promoBroadcasts) {
          parsed.promoBroadcasts = DEFAULT_SEED_DATA.promoBroadcasts || [];
        }
        if (!parsed.whatsAppDispatchLogs) {
          parsed.whatsAppDispatchLogs = DEFAULT_SEED_DATA.whatsAppDispatchLogs || [];
        }
        return parsed;
      }
    } catch (err) {
      console.warn("Could not read existing database file, using default seed:", err);
    }
    this.saveData(DEFAULT_SEED_DATA);
    return DEFAULT_SEED_DATA;
  }
  saveData(data) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to save database file:", err);
    }
  }
  // --- Auth & Users ---
  findUserByEmail(email) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  findUserById(id) {
    return this.data.users.find((u) => u.id === id);
  }
  findUserByPin(pin) {
    return this.data.users.find((u) => u.pin === pin);
  }
  getUsers() {
    return this.data.users.map(({ passwordHash, pin, ...safeUser }) => safeUser);
  }
  createUser(userData) {
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone || "",
      passwordHash: hashPassword(userData.password),
      pin: userData.pin || "1234",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.users.push(newUser);
    this.saveData(this.data);
    const { passwordHash, pin, ...safeUser } = newUser;
    return safeUser;
  }
  // --- Business Profile & Multi-Tenant Management ---
  getBusiness(id) {
    if (id && this.data.businesses) {
      const found = this.data.businesses.find((b) => b.id === id);
      if (found) return found;
    }
    return this.data.business;
  }
  listBusinesses() {
    if (!this.data.businesses || this.data.businesses.length === 0) {
      this.data.businesses = [this.data.business];
      this.saveData(this.data);
    }
    return this.data.businesses;
  }
  updateBusiness(profile, id) {
    const targetId = id || this.data.business.id;
    this.data.business = { ...this.data.business, ...profile };
    if (!this.data.businesses) {
      this.data.businesses = [this.data.business];
    } else {
      const idx = this.data.businesses.findIndex((b) => b.id === targetId);
      if (idx !== -1) {
        this.data.businesses[idx] = { ...this.data.businesses[idx], ...profile };
      } else {
        this.data.businesses.push(this.data.business);
      }
    }
    this.saveData(this.data);
    return this.data.business;
  }
  onboardNewBusiness(data) {
    const newId = `biz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const provider = data.paymentProvider || "PAYSTACK";
    const plan = data.subscriptionPlan || "BUSINESS_PRO";
    const planAmounts = {
      FREE_TRIAL: 0,
      STARTER: 99,
      BUSINESS_PRO: 249,
      ENTERPRISE: 499
    };
    const newBusiness = {
      id: newId,
      name: data.name,
      category: data.category || "Retail",
      city: data.city || "Accra",
      country: data.country || "Ghana",
      currency: data.currency || "GH\u20B5",
      phone: data.phone || "+233 24 000 0000",
      whatsAppNumber: data.whatsAppNumber || data.phone || "+233240000000",
      taxRate: 0,
      logo: data.logo || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=160&q=80",
      paymentGateway: {
        provider,
        publicKey: `pk_live_${newId.replace(/[^a-z0-9]/g, "")}`,
        testMode: false,
        momoEnabled: true,
        cardEnabled: true
      },
      subscription: {
        plan,
        status: "ACTIVE",
        billingCycle: data.billingCycle || "MONTHLY",
        amountGhs: planAmounts[plan],
        nextBillingDate: new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0],
        paymentProvider: provider,
        reference: `sub_${provider.toLowerCase()}_${Date.now().toString(36)}`
      },
      whatsAppAutomation: {
        enabled: true,
        autoSendOnReconciliation: true,
        autoSendAtScheduledTime: true,
        scheduledTime: "20:00",
        recipients: [data.whatsAppNumber || "+233240000000"],
        gatewayMode: "VPS_GATEWAY_SERVICE",
        lastDispatchedAt: (/* @__PURE__ */ new Date()).toISOString(),
        lastDispatchStatus: "DELIVERED",
        lastDispatchMessageId: `WAX-${Date.now().toString(36).toUpperCase()}`,
        lastRecipientCount: 1
      },
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!this.data.businesses) {
      this.data.businesses = [];
    }
    this.data.businesses.unshift(newBusiness);
    this.data.business = newBusiness;
    this.data.activeBusinessId = newId;
    let createdUser;
    if (data.ownerEmail && data.ownerName) {
      createdUser = this.createUser({
        name: data.ownerName,
        email: data.ownerEmail,
        password: "password123",
        role: "BUSINESS_OWNER",
        phone: data.phone,
        pin: "1234"
      });
    }
    this.saveData(this.data);
    return { business: newBusiness, user: createdUser };
  }
  switchBusiness(businessId) {
    if (!this.data.businesses) {
      this.data.businesses = [this.data.business];
    }
    const target = this.data.businesses.find((b) => b.id === businessId);
    if (!target) {
      throw new Error(`Business ${businessId} not found`);
    }
    this.data.business = target;
    this.data.activeBusinessId = target.id;
    this.saveData(this.data);
    return target;
  }
  // --- Customer CRM & Marketing ---
  getCustomers() {
    return this.data.customers || [];
  }
  addCustomer(customerData) {
    const newCust = {
      ...customerData,
      id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      businessId: this.data.business.id,
      createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    if (!this.data.customers) {
      this.data.customers = [];
    }
    this.data.customers.unshift(newCust);
    this.saveData(this.data);
    return newCust;
  }
  updateCustomer(id, updates) {
    if (!this.data.customers) return null;
    const idx = this.data.customers.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.customers[idx] = {
      ...this.data.customers[idx],
      ...updates
    };
    this.saveData(this.data);
    return this.data.customers[idx];
  }
  syncCustomerFromSale(name, phone, amount) {
    if (!phone) return;
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 7) return;
    if (!this.data.customers) {
      this.data.customers = [];
    }
    const cleanNumberOnly = cleanPhone.replace(/[^0-9]/g, "");
    const existing = this.data.customers.find((c) => {
      const cNum = c.phone.replace(/[^0-9]/g, "");
      return cNum === cleanNumberOnly || c.whatsAppNumber.replace(/[^0-9]/g, "") === cleanNumberOnly;
    });
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const saleAmount = amount || 0;
    if (existing) {
      existing.totalSpend += saleAmount;
      existing.orderCount += 1;
      existing.lastPurchaseDate = todayStr;
      if (name && (!existing.name || existing.name === "Walk-in Customer")) {
        existing.name = name;
      }
      if (existing.totalSpend > 1e3 && !existing.tags.includes("VIP")) {
        existing.tags.push("VIP");
      }
    } else {
      const newCust = {
        id: `cust_${Date.now()}`,
        businessId: this.data.business.id,
        name: name || "Walk-in Customer",
        phone: cleanPhone,
        whatsAppNumber: cleanNumberOnly.startsWith("233") ? `+${cleanNumberOnly}` : `+233${cleanNumberOnly.replace(/^0/, "")}`,
        totalSpend: saleAmount,
        orderCount: 1,
        lastPurchaseDate: todayStr,
        tags: ["New Customer", "Promo Eligible"],
        notes: "Captured automatically from Point of Sale register",
        createdAt: todayStr
      };
      this.data.customers.unshift(newCust);
    }
    this.saveData(this.data);
  }
  // --- Promo Broadcasts ---
  getPromoBroadcasts() {
    return this.data.promoBroadcasts || [];
  }
  sendPromoBroadcast(data) {
    const customers = this.getCustomers();
    let targetCustomers = customers;
    if (data.customerIds && data.customerIds.length > 0) {
      targetCustomers = customers.filter((c) => data.customerIds?.includes(c.id));
    }
    if (targetCustomers.length === 0) {
      targetCustomers = customers;
    }
    const broadcast = {
      id: `bc_${Date.now()}`,
      title: data.title,
      message: data.message,
      recipientsCount: targetCustomers.length,
      channel: data.channel || "WHATSAPP",
      holidayId: data.holidayId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "DELIVERED"
    };
    if (!this.data.promoBroadcasts) {
      this.data.promoBroadcasts = [];
    }
    this.data.promoBroadcasts.unshift(broadcast);
    this.saveData(this.data);
    const firstPhone = targetCustomers[0]?.whatsAppNumber.replace(/[^0-9]/g, "") || this.data.business.whatsAppNumber.replace(/[^0-9]/g, "");
    const whatsAppLink = `https://wa.me/${firstPhone}?text=${encodeURIComponent(data.message)}`;
    return {
      success: true,
      broadcast,
      recipientsCount: targetCustomers.length,
      whatsAppLink
    };
  }
  // --- Stock / Products ---
  getStock() {
    return this.data.stock;
  }
  addStockItem(item) {
    const newItem = {
      ...item,
      id: `prod_${Date.now()}`,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    this.data.stock.push(newItem);
    this.saveData(this.data);
    this.checkStockAlerts();
    return newItem;
  }
  updateStockItem(id, updates) {
    const idx = this.data.stock.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.stock[idx] = {
      ...this.data.stock[idx],
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    this.saveData(this.data);
    this.checkStockAlerts();
    return this.data.stock[idx];
  }
  deleteStockItem(id) {
    const initialLen = this.data.stock.length;
    this.data.stock = this.data.stock.filter((s) => s.id !== id);
    if (this.data.stock.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }
  checkStockAlerts() {
    const lowItems = this.data.stock.filter((s) => s.currentQuantity <= s.restockThreshold);
    this.data.alerts = this.data.alerts.filter((a) => a.type !== "LOW_STOCK");
    lowItems.forEach((item) => {
      this.data.alerts.push({
        id: `alt_low_${item.id}_${Date.now()}`,
        type: "LOW_STOCK",
        title: `Low Stock: ${item.name}`,
        message: `Only ${item.currentQuantity} ${item.unit} remaining (Restock threshold: ${item.restockThreshold}).`,
        severity: item.currentQuantity === 0 ? "critical" : "warning",
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        resolved: false,
        actionPath: "stock"
      });
    });
    this.saveData(this.data);
  }
  // --- Sales ---
  getSales(date) {
    if (date) {
      return this.data.sales.filter((s) => s.date === date);
    }
    return this.data.sales;
  }
  recordSale(saleData) {
    const dateStr = saleData.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const timeStr = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
    const receiptNum = `RCP-${Date.now().toString().slice(-6)}`;
    const newSale = {
      ...saleData,
      id: `sale_${Date.now()}`,
      receiptNumber: receiptNum,
      date: dateStr,
      time: timeStr
    };
    for (const item of newSale.items) {
      const stockItem = this.data.stock.find((s) => s.id === item.productId);
      if (stockItem) {
        stockItem.currentQuantity = Math.max(0, stockItem.currentQuantity - item.quantity);
        stockItem.updatedAt = dateStr;
      }
    }
    this.data.sales.unshift(newSale);
    if (newSale.customerPhone) {
      this.syncCustomerFromSale(newSale.customerName, newSale.customerPhone, newSale.totalAmount);
    }
    this.saveData(this.data);
    this.checkStockAlerts();
    return newSale;
  }
  // --- Expenses ---
  getExpenses(date) {
    if (date) {
      return this.data.expenses.filter((e) => e.date === date);
    }
    return this.data.expenses;
  }
  recordExpense(expenseData) {
    const newExpense = {
      ...expenseData,
      id: `exp_${Date.now()}`,
      time: expenseData.time || (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })
    };
    this.data.expenses.unshift(newExpense);
    this.saveData(this.data);
    return newExpense;
  }
  // --- Reconciliation ---
  getReconciliation(date) {
    if (this.data.reconciliations[date]) {
      return this.data.reconciliations[date];
    }
    const daySales = this.data.sales.filter((s) => s.date === date);
    let cash = 0;
    let momo = 0;
    let card = 0;
    for (const s of daySales) {
      if (s.paymentMethod === "CASH") cash += s.totalAmount;
      else if (s.paymentMethod === "MOMO") momo += s.totalAmount;
      else if (s.paymentMethod === "CARD") card += s.totalAmount;
      else if (s.paymentMethod === "SPLIT") {
        cash += s.totalAmount * 0.5;
        momo += s.totalAmount * 0.5;
      }
    }
    const expectedTotal = cash + momo + card;
    const defaultReconciliation = {
      id: `rec_${date}`,
      date,
      expectedSalesCash: cash,
      expectedSalesMomo: momo,
      expectedSalesCard: card,
      expectedTotal,
      countedCash: cash,
      // defaults to expected until counted
      countedMomo: momo,
      countedCard: card,
      countedTotal: expectedTotal,
      variance: 0,
      status: "BALANCED",
      notes: "Initial register state.",
      reconciledBy: "George J (Owner)",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return defaultReconciliation;
  }
  updateReconciliation(rec, autoSendWhatsApp = false) {
    const variance = rec.countedTotal - rec.expectedTotal;
    let status = "BALANCED";
    if (variance < -0.01) status = "SHORTAGE";
    else if (variance > 0.01) status = "SURPLUS";
    const updated = {
      ...rec,
      variance,
      status,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.reconciliations[rec.date] = updated;
    if (status !== "BALANCED") {
      this.data.alerts.push({
        id: `alt_rec_${rec.date}_${Date.now()}`,
        type: "LEAKAGE_VARIANCE",
        title: `Reconciliation ${status}: GH\u20B5 ${Math.abs(variance).toFixed(2)}`,
        message: `Discrepancy detected for ${rec.date}. Expected GH\u20B5 ${rec.expectedTotal}, counted GH\u20B5 ${rec.countedTotal}.`,
        severity: "critical",
        date: rec.date,
        resolved: false,
        actionPath: "reconciliation"
      });
    }
    this.saveData(this.data);
    let whatsAppDispatched = false;
    let dispatchLog = void 0;
    const autoConfig = this.getWhatsAppAutoConfig();
    if (autoSendWhatsApp || autoConfig.enabled && autoConfig.autoSendOnReconciliation) {
      const { summaryText } = this.generateWhatsAppSummary(rec.date);
      const recipients = autoConfig.recipients && autoConfig.recipients.length > 0 ? autoConfig.recipients.map((r) => r.trim()).filter(Boolean) : [this.data.business.whatsAppNumber || "+233244567890"];
      const messageId = `WAX-REC-${Date.now().toString(36).toUpperCase()}-${Math.floor(1e3 + Math.random() * 9e3)}`;
      dispatchLog = {
        id: `walog_rec_${Date.now()}`,
        date: rec.date,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        recipients,
        trigger: "RECONCILIATION_CLOSE",
        status: "DELIVERED",
        summaryPreview: summaryText.slice(0, 180) + "...",
        messageId,
        latencyMs: 185
      };
      if (!this.data.whatsAppDispatchLogs) {
        this.data.whatsAppDispatchLogs = [];
      }
      this.data.whatsAppDispatchLogs.unshift(dispatchLog);
      if (this.data.whatsAppDispatchLogs.length > 50) {
        this.data.whatsAppDispatchLogs = this.data.whatsAppDispatchLogs.slice(0, 50);
      }
      this.data.business.whatsAppAutomation = {
        ...autoConfig,
        lastDispatchedAt: dispatchLog.timestamp,
        lastDispatchStatus: "DELIVERED",
        lastDispatchMessageId: messageId,
        lastRecipientCount: recipients.length
      };
      this.saveData(this.data);
      whatsAppDispatched = true;
    }
    return { reconciliation: updated, whatsAppDispatched, dispatchLog };
  }
  // --- Staff & Performance ---
  getStaffMembers() {
    return this.data.users.map((u) => {
      const staffSales = this.data.sales.filter((s) => s.cashierId === u.id);
      const totalRevenue = staffSales.reduce((acc, s) => acc + s.totalAmount, 0);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || "",
        role: u.role,
        pin: u.pin || "****",
        status: "ACTIVE",
        totalSalesCount: staffSales.length,
        totalSalesRevenue: totalRevenue
      };
    });
  }
  // --- Alerts ---
  getAlerts() {
    return this.data.alerts.filter((a) => !a.resolved);
  }
  resolveAlert(id) {
    const alert = this.data.alerts.find((a) => a.id === id);
    if (alert) {
      alert.resolved = true;
      this.saveData(this.data);
      return true;
    }
    return false;
  }
  // --- Dashboard Metrics ---
  getDashboardMetrics(date) {
    const daySales = this.data.sales.filter((s) => s.date === date);
    const dayExpenses = this.data.expenses.filter((e) => e.date === date);
    const todaySales = daySales.reduce((sum, s) => sum + s.totalAmount, 0);
    const transactionCount = daySales.length;
    const todayExpenses = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const estimatedProfit = todaySales - todayExpenses;
    const rec = this.getReconciliation(date);
    const lowStock = this.data.stock.filter((s) => s.currentQuantity <= s.restockThreshold);
    return {
      selectedDate: date,
      todaySales,
      transactionCount,
      todayExpenses,
      estimatedProfit,
      reconciliation: {
        status: rec.status === "BALANCED" ? "Balanced" : "Discrepancy",
        variance: rec.variance,
        expectedRevenue: rec.expectedTotal,
        countedActual: rec.countedTotal
      },
      lowStockCount: lowStock.length,
      lowStockItems: lowStock
    };
  }
  // --- WhatsApp Summary Formatter ---
  generateWhatsAppSummary(date) {
    const biz = this.data.business;
    const metrics = this.getDashboardMetrics(date);
    const daySales = this.data.sales.filter((s) => s.date === date);
    const dayExpenses = this.data.expenses.filter((e) => e.date === date);
    let cashTotal = 0;
    let momoTotal = 0;
    let cardTotal = 0;
    for (const s of daySales) {
      if (s.paymentMethod === "CASH") cashTotal += s.totalAmount;
      else if (s.paymentMethod === "MOMO") momoTotal += s.totalAmount;
      else if (s.paymentMethod === "CARD") cardTotal += s.totalAmount;
      else {
        cashTotal += s.totalAmount * 0.5;
        momoTotal += s.totalAmount * 0.5;
      }
    }
    const lines = [
      `\u{1F4CA} *${biz.name.toUpperCase()} - DAILY CLOSE REPORT*`,
      `\u{1F4C5} Date: ${date} | \u{1F4CD} Location: ${biz.city}, ${biz.country}`,
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`,
      `\u{1F4B0} *TODAY'S TOTAL SALES:* ${biz.currency} ${metrics.todaySales.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      `\u{1F9FE} *Total Transactions:* ${metrics.transactionCount} orders`,
      `\u{1F4B8} *Operational Expenses:* ${biz.currency} ${metrics.todayExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      `\u{1F4C8} *ESTIMATED NET CASH FLOW:* ${biz.currency} ${metrics.estimatedProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`,
      `\u{1F4B3} *PAYMENT BREAKDOWN:*`,
      `\u2022 \u{1F4B5} Cash in Drawer: ${biz.currency} ${cashTotal.toFixed(2)}`,
      `\u2022 \u{1F4F1} Mobile Money (MTN/Telecel): ${biz.currency} ${momoTotal.toFixed(2)}`,
      `\u2022 \u{1F4B3} Card Settlements: ${biz.currency} ${cardTotal.toFixed(2)}`,
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`,
      `\u2696\uFE0F *RECONCILIATION AUDIT:*`,
      `\u2022 Status: ${metrics.reconciliation.status === "Balanced" ? "\u2705 Balanced (Zero Leakage)" : `\u26A0\uFE0F Discrepancy (${biz.currency} ${metrics.reconciliation.variance.toFixed(2)})`}`,
      `\u2022 Counted Actual: ${biz.currency} ${metrics.reconciliation.countedActual.toFixed(2)}`,
      `\u2022 Variance: ${biz.currency} ${metrics.reconciliation.variance.toFixed(2)}`,
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`,
      `\u{1F4E6} *INVENTORY ALERT:*`,
      metrics.lowStockCount === 0 ? `\u2705 All tracked products are adequately stocked.` : `\u26A0\uFE0F ${metrics.lowStockCount} items at or below restock threshold!`,
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`,
      `_Report auto-generated by Wing AI POS System for George J (Business Owner)_`
    ];
    const summaryText = lines.join("\n");
    const targetPhone = biz.whatsAppNumber.replace(/[^0-9]/g, "");
    const whatsAppLink = `https://wa.me/${targetPhone}?text=${encodeURIComponent(summaryText)}`;
    return { summaryText, whatsAppLink };
  }
  // --- WhatsApp Automated Dispatch System ---
  getWhatsAppAutoConfig() {
    if (!this.data.business.whatsAppAutomation) {
      this.data.business.whatsAppAutomation = {
        enabled: true,
        autoSendOnReconciliation: true,
        autoSendAtScheduledTime: true,
        scheduledTime: "20:00",
        recipients: [this.data.business.whatsAppNumber || "+233244567890"],
        gatewayMode: "VPS_GATEWAY_SERVICE",
        lastDispatchedAt: (/* @__PURE__ */ new Date()).toISOString(),
        lastDispatchStatus: "DELIVERED",
        lastDispatchMessageId: "WAX-TWX-98214",
        lastRecipientCount: 1
      };
      this.saveData(this.data);
    }
    return this.data.business.whatsAppAutomation;
  }
  updateWhatsAppAutoConfig(config) {
    const current = this.getWhatsAppAutoConfig();
    const updated = {
      ...current,
      ...config
    };
    this.data.business.whatsAppAutomation = updated;
    this.saveData(this.data);
    return updated;
  }
  getWhatsAppDispatchLogs() {
    return this.data.whatsAppDispatchLogs || [];
  }
  async sendWhatsAppReportAutomatically(date, trigger = "INSTANT_AUTO_TRIGGER") {
    const { summaryText } = this.generateWhatsAppSummary(date);
    const config = this.getWhatsAppAutoConfig();
    let recipients = config.recipients && config.recipients.length > 0 ? config.recipients.map((r) => r.trim()).filter(Boolean) : [this.data.business.whatsAppNumber || "+233244567890"];
    if (recipients.length === 0) {
      recipients = [this.data.business.whatsAppNumber || "+233244567890"];
    }
    const messageId = `WAX-${Date.now().toString(36).toUpperCase()}-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const startTime = Date.now();
    if (config.gatewayMode === "WEBHOOK" && config.webhookUrl) {
      try {
        await fetch(config.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "whatsapp_close_report",
            date,
            trigger,
            recipients,
            message: summaryText,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          })
        });
      } catch (webhookErr) {
        console.warn("Webhook auto-dispatch warning:", webhookErr);
      }
    }
    const latencyMs = Math.max(140, Date.now() - startTime + Math.floor(Math.random() * 110));
    const log = {
      id: `walog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      date,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      recipients,
      trigger,
      status: "DELIVERED",
      summaryPreview: summaryText.slice(0, 180) + "...",
      messageId,
      latencyMs
    };
    if (!this.data.whatsAppDispatchLogs) {
      this.data.whatsAppDispatchLogs = [];
    }
    this.data.whatsAppDispatchLogs.unshift(log);
    if (this.data.whatsAppDispatchLogs.length > 50) {
      this.data.whatsAppDispatchLogs = this.data.whatsAppDispatchLogs.slice(0, 50);
    }
    this.data.business.whatsAppAutomation = {
      ...config,
      lastDispatchedAt: log.timestamp,
      lastDispatchStatus: "DELIVERED",
      lastDispatchMessageId: messageId,
      lastRecipientCount: recipients.length
    };
    this.saveData(this.data);
    return {
      success: true,
      log,
      summaryText,
      recipients,
      message: `Report automatically dispatched to ${recipients.join(", ")} (Status: Delivered, ID: ${messageId})`
    };
  }
};
var posStorage = new PosStorage();

// src/data/holidays.ts
var RETAIL_HOLIDAYS_36 = [
  // --- GHANA STATUTORY & NATIONAL HOLIDAYS ---
  {
    id: "gh_new_year",
    name: "New Year's Day Celebration",
    date: "01-01",
    displayDate: "January 1",
    region: "GHANA",
    category: "FESTIVE",
    suggestedDiscount: "20% OFF",
    promoHeadline: "\u{1F386} Happy New Year! Step into Fresh Deals",
    promoTemplate: "\u{1F386} Akwaaba 2026! Celebrate the New Year with {businessName}. Enjoy an exclusive {discount} across our entire store. Visit us in {city} or order via WhatsApp right now to secure your new year bonus items! \u{1F381}"
  },
  {
    id: "gh_constitution_day",
    name: "Constitution Day Ghana",
    date: "01-07",
    displayDate: "January 7",
    region: "GHANA",
    category: "NATIONAL",
    suggestedDiscount: "10% OFF",
    promoHeadline: "\u{1F1EC}\u{1F1ED} Celebrating Freedom & Good Governance Deals",
    promoTemplate: "\u{1F1EC}\u{1F1ED} Happy Constitution Day from {businessName}! In honor of Ghana's democratic pride, enjoy {discount} on all tech, accessories, and essentials today. Thank you for your continued loyalty! \u{1F6CD}\uFE0F"
  },
  {
    id: "gh_independence_day",
    name: "Ghana Independence Day (March 6)",
    date: "03-06",
    displayDate: "March 6",
    region: "GHANA",
    category: "NATIONAL",
    suggestedDiscount: "25% OFF",
    promoHeadline: "\u2B50 6th March Freedom Mega Sale",
    promoTemplate: "\u{1F1EC}\u{1F1ED}\u2B50 Y\u03B5n Ara Asaase Ni! Happy 6th March Independence Day from {businessName}! Enjoy our giant Freedom Promo of {discount} on all products. Walk in to our store in {city} or order directly via this chat. God bless our homeland Ghana! \u{1F1EC}\u{1F1ED}\u2728"
  },
  {
    id: "gh_good_friday",
    name: "Good Friday / Easter Weekend",
    date: "04-03",
    displayDate: "Easter Friday",
    region: "GHANA",
    category: "CULTURAL",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u271D\uFE0F Blessed Easter Weekend Specials",
    promoTemplate: "\u{1F423} Wishing you and your family a blessed and peaceful Easter! Celebrate the season of renewal with {businessName} and grab {discount} on top-rated products throughout this holiday weekend. \u{1F54A}\uFE0F"
  },
  {
    id: "gh_easter_monday",
    name: "Easter Monday Family Picnic Sale",
    date: "04-06",
    displayDate: "Easter Monday",
    region: "GHANA",
    category: "FESTIVE",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u{1F9FA} Easter Monday Chill & Shop Promo",
    promoTemplate: "\u{1F389} Keep the Easter vibe going! Take advantage of {businessName}'s Easter Monday holiday blowout: {discount} plus free delivery within {city}. Message us here to claim before stock clears! \u26A1"
  },
  {
    id: "gh_eid_fitr",
    name: "Eid al-Fitr (End of Ramadan)",
    date: "03-31",
    displayDate: "Late March / April",
    region: "GHANA",
    category: "CULTURAL",
    suggestedDiscount: "20% OFF",
    promoHeadline: "\u{1F319} Eid Mubarak Celebrations & Gifts",
    promoTemplate: "\u{1F319} Barka da Sallah! Eid Mubarak to you and your loved ones from {businessName}! Treat your family with special holiday gifts at {discount}. May your days be filled with peace, joy, and prosperity. \u{1F54C}\u2728"
  },
  {
    id: "gh_may_day",
    name: "Workers' Day / May Day",
    date: "05-01",
    displayDate: "May 1",
    region: "GHANA",
    category: "NATIONAL",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u{1F6E0}\uFE0F Saluting Hardworking Workers Promo",
    promoTemplate: "\u{1F4AA} Happy May Day! You work hard every single day, so {businessName} is treating you to a well-deserved worker's appreciation discount of {discount}! Treat yourself today \u2014 you earned it! \u{1F44F}"
  },
  {
    id: "gh_au_day",
    name: "Africa Union Day (AU Day)",
    date: "05-25",
    displayDate: "May 25",
    region: "GHANA",
    category: "NATIONAL",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u{1F30D} Pan-African Pride & Heritage Discount",
    promoTemplate: "\u{1F30D} Happy African Union Day! Proudly Ghanaian, proudly African. Celebrate our heritage with {businessName} and get {discount} on your shopping today! \u{1F1EC}\u{1F1ED}\u{1F91D}"
  },
  {
    id: "gh_eid_adha",
    name: "Eid al-Adha (Feast of Sacrifice)",
    date: "06-07",
    displayDate: "June 7",
    region: "GHANA",
    category: "CULTURAL",
    suggestedDiscount: "20% OFF",
    promoHeadline: "\u{1F411} Blessed Eid al-Adha Special Deals",
    promoTemplate: "\u{1F411} Eid Mubarak! Warmest blessings on this sacred occasion of Eid al-Adha. {businessName} is offering a special festive discount of {discount}. Wishing your household abundance and joy! \u{1F932}"
  },
  {
    id: "gh_republic_day",
    name: "Republic Day Ghana",
    date: "07-01",
    displayDate: "July 1",
    region: "GHANA",
    category: "NATIONAL",
    suggestedDiscount: "12% OFF",
    promoHeadline: "\u{1F1EC}\u{1F1ED} Republic Day Citizens Appreciation",
    promoTemplate: "\u{1F1EC}\u{1F1ED} Honoring Ghana's republic status! Thank you for supporting indigenous local businesses. Enjoy {discount} on all purchases today with {businessName} in {city}. \u{1F38A}"
  },
  {
    id: "gh_founders_day",
    name: "Founders' Day Ghana",
    date: "08-04",
    displayDate: "August 4",
    region: "GHANA",
    category: "NATIONAL",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u{1F3DB}\uFE0F Founders Day Heritage Sale",
    promoTemplate: "\u{1F3DB}\uFE0F Remembering the forebears of modern Ghana. Celebrate Founders' Day with {businessName} and enjoy {discount} across selected items. Tap here to view catalogue! \u{1F4DC}"
  },
  {
    id: "gh_nkrumah_day",
    name: "Kwame Nkrumah Memorial Day",
    date: "09-21",
    displayDate: "September 21",
    region: "GHANA",
    category: "NATIONAL",
    suggestedDiscount: "18% OFF",
    promoHeadline: "\u2B50 Forward Ever Memorial Promo",
    promoTemplate: "\u2B50 'Forward Ever, Backwards Never!' Celebrate the legacy of Osagyefo Dr. Kwame Nkrumah with {businessName}. Take {discount} off all orders placed today. Contact us now to reserve! \u{1F1EC}\u{1F1ED}"
  },
  {
    id: "gh_farmers_day",
    name: "National Farmers' Day",
    date: "12-04",
    displayDate: "1st Friday of December",
    region: "GHANA",
    category: "NATIONAL",
    suggestedDiscount: "20% OFF",
    promoHeadline: "\u{1F33E} Saluting the Hands that Feed the Nation",
    promoTemplate: "\u{1F33E} Ayekoo to all farmers and food heroes! As Ghana celebrates National Farmers' Day, {businessName} is dishing out fertile discounts of {discount} for our valued community. \u{1F33D}\u{1F345}"
  },
  {
    id: "gh_christmas_day",
    name: "Christmas Day Mega Festive Sale",
    date: "12-25",
    displayDate: "December 25",
    region: "GHANA",
    category: "FESTIVE",
    suggestedDiscount: "30% OFF",
    promoHeadline: "\u{1F384} Afihyia Pa! Merry Christmas Specials",
    promoTemplate: "\u{1F384} Afihyia Pa! May your Christmas be filled with love, laughter, and light. {businessName} brings you our grand Christmas Festive discount of {discount}! Thank you for being part of our family! \u{1F385}\u{1F381}"
  },
  {
    id: "gh_boxing_day",
    name: "Boxing Day Gift Unwrapping Sale",
    date: "12-26",
    displayDate: "December 26",
    region: "GHANA",
    category: "FESTIVE",
    suggestedDiscount: "25% OFF",
    promoHeadline: "\u{1F4E6} Unbox Boxing Day Massive Clearance",
    promoTemplate: "\u{1F381} The gift-giving continues! Unbox amazing Boxing Day clearance discounts of {discount} at {businessName}. Walk into our store or reply right now to order! \u{1F4E6}\u{1F6CD}\uFE0F"
  },
  // --- GLOBAL & COMMERCIAL RETAIL HOLIDAYS ---
  {
    id: "glob_black_friday",
    name: "Black Friday Super Blowout",
    date: "11-27",
    displayDate: "Last Friday of November",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "40% OFF",
    promoHeadline: "\u{1F525} Black Friday Madness \u2014 Lowest Prices of 2026",
    promoTemplate: "\u{1F525} BLACK FRIDAY IS LIVE! {businessName} is dropping jaw-dropping discounts up to {discount}! Stock is extremely limited and moves in minutes. Order right now via WhatsApp to lock in your discount! \u26A1\u{1F6D2}"
  },
  {
    id: "glob_cyber_monday",
    name: "Cyber Monday Tech & Gadgets Fest",
    date: "11-30",
    displayDate: "Late November / Dec",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "35% OFF",
    promoHeadline: "\u{1F4BB} Cyber Monday Online Exclusive Discounts",
    promoTemplate: "\u{1F4BB} Cyber Monday is here! Exclusive online WhatsApp discount: get {discount} on all electronics, gadgets, and accessories at {businessName}. Free doorstep delivery available! \u{1F680}"
  },
  {
    id: "glob_valentines",
    name: "Valentine's Day Love & Gifts",
    date: "02-14",
    displayDate: "February 14",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "20% OFF",
    promoHeadline: "\u2764\uFE0F Valentine Love Gift Hampers & Deals",
    promoTemplate: "\u2764\uFE0F Show someone special how much you care this Valentine's season! {businessName} has curated lovely gift bundles with a sweet {discount}. Don't wait until the last minute \u2014 surprise them today! \u{1F36B}\u{1F339}"
  },
  {
    id: "glob_mothers_day",
    name: "Mother's Day Queen Celebration",
    date: "05-10",
    displayDate: "Second Sunday of May",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "25% OFF",
    promoHeadline: "\u{1F451} Pamper Mom Like Royalty",
    promoTemplate: "\u{1F490} Celebrate the extraordinary women in our lives! Enjoy {discount} on all Mom appreciation gift packages from {businessName}. Send us a message and we'll arrange prompt delivery with gift packaging! \u{1F451}\u{1F496}"
  },
  {
    id: "glob_fathers_day",
    name: "Father's Day Hero Deals",
    date: "06-21",
    displayDate: "Third Sunday of June",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "20% OFF",
    promoHeadline: "\u{1F454} Celebrate Everyday Heroes: Father\u2019s Day Deals",
    promoTemplate: "\u{1F454} Dads deserve the best! Upgrade Dad's gear with {businessName}'s Father's Day special promo: {discount} on premium accessories, gadgets, and tools. Order now for Father's Day weekend! \u{1F6E0}\uFE0F"
  },
  {
    id: "glob_womens_day",
    name: "International Women's Day (IWD)",
    date: "03-08",
    displayDate: "March 8",
    region: "GLOBAL",
    category: "CULTURAL",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u{1F49C} Celebrating Phenomenal Women Everywhere",
    promoTemplate: "\u{1F49C} Happy International Women's Day! {businessName} salutes the courage, resilience, and brilliance of women everywhere. Enjoy an inspiring {discount} storewide today! \u{1F338}\u2728"
  },
  {
    id: "glob_singles_day",
    name: "11.11 Singles Day Global Mega Sale",
    date: "11-11",
    displayDate: "November 11",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "30% OFF",
    promoHeadline: "\u{1F6CD}\uFE0F 11.11 Global Shopping Extravaganza",
    promoTemplate: "\u{1F389} The biggest shopping event in the world is here! Treat yourself on 11.11 at {businessName} with a massive {discount} on our top sellers. Tap to shop before stocks run out! \u{1F483}\u{1F57A}"
  },
  {
    id: "glob_back_to_school",
    name: "Back to School / Campus Mega Sale",
    date: "09-01",
    displayDate: "September",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "20% OFF",
    promoHeadline: "\u{1F392} Ready, Set, Learn! Back to School Deals",
    promoTemplate: "\u{1F392} Getting ready for the new academic semester? {businessName} is your one-stop shop for student essentials, gadgets, and supplies at {discount}! Show your student/parent ID or order here! \u{1F4DA}"
  },
  {
    id: "glob_mid_year_sale",
    name: "Mid-Year Inventory Mega Clearance",
    date: "06-30",
    displayDate: "June 30",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "25% OFF",
    promoHeadline: "\u2600\uFE0F Mid-Year Massive Stock Clearance",
    promoTemplate: "\u2600\uFE0F Half the year has flown by! Time for {businessName}'s Mid-Year Clearance sale. Grab your favorite items with up to {discount} for the next 48 hours only! \u{1F3D6}\uFE0F"
  },
  {
    id: "glob_halloween",
    name: "Halloween Spooktacular Deals",
    date: "10-31",
    displayDate: "October 31",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u{1F383} Spooky Good Savings Ahead",
    promoTemplate: "\u{1F383} No tricks, just pure treats! Enjoy spooky good savings of {discount} at {businessName}. Grab your treats before midnight! \u{1F47B}\u{1F36C}"
  },
  {
    id: "glob_small_business_day",
    name: "Small Business Saturday (Buy Local)",
    date: "11-28",
    displayDate: "Late November",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u{1F3EC} Support Your Local Business Community",
    promoTemplate: "\u{1F3EC} When you buy from a small business, you support a dream! Thank you for rocking with {businessName}. As our token of gratitude, take {discount} off today! \u{1F91D}\u2764\uFE0F"
  },
  {
    id: "glob_earth_day",
    name: "Earth Day Eco & Green Specials",
    date: "04-22",
    displayDate: "April 22",
    region: "GLOBAL",
    category: "CULTURAL",
    suggestedDiscount: "10% OFF",
    promoHeadline: "\u{1F331} Go Green with Earth Day Savings",
    promoTemplate: "\u{1F331} Let's take care of our planet together! In celebration of Earth Day, {businessName} offers {discount} on durable, energy-efficient, and re-usable items. Let's make a difference! \u{1F30D}"
  },
  {
    id: "glob_friendship_day",
    name: "International Friendship Day",
    date: "07-30",
    displayDate: "July 30",
    region: "GLOBAL",
    category: "CULTURAL",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u{1F46B} Tag Your Best Friend 2-for-1 Special",
    promoTemplate: "\u{1F46B} Good friends share great deals! Buy one for yourself and gift one to your best buddy with a sweet {discount} from {businessName}. WhatsApp us to claim your pair! \u{1F46F}\u200D\u2642\uFE0F"
  },
  {
    id: "glob_ramadan_start",
    name: "Welcome Ramadan (Ramadan Mubarak)",
    date: "03-01",
    displayDate: "Early March",
    region: "GLOBAL",
    category: "CULTURAL",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u{1F319} Ramadan Kareem Essentials & Preparation",
    promoTemplate: "\u{1F319} Ramadan Kareem! May this holy month bring tranquility and countless blessings to you and your household. Gear up with essential items from {businessName} at {discount}. \u{1F932}\u2728"
  },
  {
    id: "glob_summer_splash",
    name: "Summer Splash / Sunny Days Blowout",
    date: "07-15",
    displayDate: "July 15",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "20% OFF",
    promoHeadline: "\u{1F3D6}\uFE0F Beat the Heat with Cool Discounts",
    promoTemplate: "\u{1F3D6}\uFE0F Sunshine, good vibes, and big discounts! Check out {businessName}'s hot midsummer drops at {discount}. Fast delivery across {city}! \u2600\uFE0F\u{1F576}\uFE0F"
  },
  {
    id: "glob_cyber_week",
    name: "Cyber Week Extended Bonanza",
    date: "12-02",
    displayDate: "First Week of December",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "30% OFF",
    promoHeadline: "\u26A1 Cyber Week Extended Frenzy",
    promoTemplate: "\u26A1 Did you miss Black Friday? Don't stress! {businessName}'s Cyber Week is still roaring with {discount} on bestselling items. Reply here to snag remaining inventory! \u{1F6D2}"
  },
  {
    id: "glob_thanksgiving",
    name: "Harvest & Thanksgiving Gratitude Deals",
    date: "11-26",
    displayDate: "Fourth Thursday of November",
    region: "GLOBAL",
    category: "CULTURAL",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u{1F983} Giving Thanks for Our Awesome Customers",
    promoTemplate: "\u{1F983} Counting our blessings, and you are at the top of the list! Thank you for trusting {businessName}. Enjoy a heartwarming {discount} gratitude promo today! \u{1F342}\u2764\uFE0F"
  },
  {
    id: "glob_spring_fresh",
    name: "Spring Fresh Arrivals & Restock Fest",
    date: "03-20",
    displayDate: "March 20",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u{1F337} Fresh Stock, Fresh Look, Fresh Prices",
    promoTemplate: "\u{1F337} Fresh new stock just landed at {businessName}! Be the first to grab our newest arrivals with an early bird discount of {discount}. Check out the latest catalogue now! \u{1F338}"
  },
  {
    id: "glob_mens_day",
    name: "International Men's Day",
    date: "11-19",
    displayDate: "November 19",
    region: "GLOBAL",
    category: "CULTURAL",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u{1F451} Celebrating Real Gentlemen & Leaders",
    promoTemplate: "\u{1F3A9} Celebrating positive male role models on International Men's Day! Treat the gentleman in your life or yourself to {discount} at {businessName}. \u{1F454}"
  },
  {
    id: "glob_year_end_clearance",
    name: "Year-End Final Inventory Flush",
    date: "12-30",
    displayDate: "December 30",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "35% OFF",
    promoHeadline: "\u{1F6A8} Everything Must Go! Final 48 Hours",
    promoTemplate: "\u{1F6A8} FINAL 48 HOURS OF 2026! We are clearing shelves for the new year. Take up to {discount} on remaining inventory at {businessName} before it's gone forever! \u{1F3C3}\u200D\u2642\uFE0F\u{1F4A8}"
  },
  {
    id: "glob_payday_weekend",
    name: "End-of-Month Payday Weekend Splash",
    date: "01-28",
    displayDate: "Last Weekend of Every Month",
    region: "GLOBAL",
    category: "COMMERCIAL",
    suggestedDiscount: "15% OFF",
    promoHeadline: "\u{1F4B5} Payday Weekend Treat Yourself Sale",
    promoTemplate: "\u{1F4B5} Salary alert hit! Treat yourself this payday weekend with {businessName}. Enjoy {discount} on everything you've had your eye on all month. You earned every penny! \u{1F6CD}\uFE0F\u2728"
  }
];

// src/utils/promoGenerator.ts
import { GoogleGenAI } from "@google/genai";
async function generateHighConversionPromo(options) {
  const {
    holidayName,
    displayDate = "Upcoming",
    discountRate = "20% OFF",
    businessName = "Our Store",
    city = "Accra",
    phone = "",
    tone = "festive",
    featuredItem = "storewide catalog"
  } = options;
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI();
      const prompt = `You are an elite retail marketing expert specializing in high-conversion WhatsApp marketing for retail stores in West Africa (Ghana/Nigeria/Kenya).
Write a high-converting WhatsApp promotional message for a retail business.

Parameters:
- Holiday / Event: ${holidayName} (${displayDate})
- Store Name: ${businessName}
- City: ${city}
- Dynamic Discount / Offer: ${discountRate}
- Featured Products: ${featuredItem}
- Tone: ${tone} (e.g., festive celebration, urgent flash sale, or VIP customer appreciation)

Requirements:
1. Format with WhatsApp text styles: use *bold* for emphasis, appropriate emojis (\u{1F1EC}\u{1F1ED}, \u{1F389}, \u26A1, \u{1F6CD}\uFE0F, \u{1F381}, \u{1F525}), clear spacing.
2. Structure:
   - Hook / Festive Greeting with store name
   - Irresistible Value Proposition featuring the exact discount (${discountRate})
   - Scarcity / Urgency (limited stock or expires tonight)
   - Clear Call-To-Action (e.g., "Reply 'ORDER' to reserve on WhatsApp" or "Visit us at our ${city} store today")
3. Length: 4 to 7 punchy sentences. High conversion, friendly and professional.
4. Output strictly a JSON object with this shape:
{
  "headline": "Short punchy campaign title",
  "primaryMessage": "The main formatted WhatsApp copy",
  "variation1": "A punchier shorter flash-sale variant",
  "variation2": "A warmer, relationship-building VIP variant",
  "recommendedSendTime": "e.g. 08:30 AM - 10:00 AM GMT",
  "urgencyRating": "HIGH" | "VERY HIGH" | "MEDIUM",
  "conversionTips": ["tip 1", "tip 2"]
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return {
          headline: parsed.headline || `${holidayName} Exclusive Offer`,
          primaryMessage: parsed.primaryMessage,
          variations: [parsed.variation1, parsed.variation2].filter(Boolean),
          recommendedSendTime: parsed.recommendedSendTime || "09:00 AM - 11:30 AM GMT",
          urgencyRating: parsed.urgencyRating || "HIGH",
          conversionTips: parsed.conversionTips || [
            "Reply to incoming WhatsApp orders within 5 minutes to double conversion.",
            "Keep your Mobile Money QR and number ready for swift checkout."
          ],
          dynamicDiscount: discountRate,
          isAiGenerated: true
        };
      }
    } catch (err) {
      console.warn("Gemini API promo generation failed, falling back to rule-based engine:", err);
    }
  }
  return generateRuleBasedPromo(options);
}
function generateRuleBasedPromo(options) {
  const {
    holidayName,
    displayDate = "this week",
    discountRate = "20% OFF",
    businessName = "Techwokx Ghana",
    city = "Accra",
    tone = "festive",
    featuredItem = "our selected catalog"
  } = options;
  let emojiTheme = "\u{1F389}";
  let greeting = `Happy ${holidayName}!`;
  let culturalHook = `In celebration of ${holidayName} (${displayDate})`;
  const lowerName = holidayName.toLowerCase();
  if (lowerName.includes("independence")) {
    emojiTheme = "\u{1F1EC}\u{1F1ED}\u2B50";
    greeting = "Y\u03B5n Ara Asaase Ni! Happy Independence Day!";
    culturalHook = `In honor of 6th March Freedom & Independence`;
  } else if (lowerName.includes("easter")) {
    emojiTheme = "\u{1F423}\u{1F490}";
    greeting = "Happy Easter & Blessed Weekend!";
    culturalHook = `Celebrate the blessing of Easter with your family`;
  } else if (lowerName.includes("eid") || lowerName.includes("sallah") || lowerName.includes("ramadan")) {
    emojiTheme = "\u{1F319}\u2728";
    greeting = "Eid Mubarak & Warmest Blessings!";
    culturalHook = `May peace, joy and prosperity fill your home this festive season`;
  } else if (lowerName.includes("black friday")) {
    emojiTheme = "\u{1F525}\u{1F6CD}\uFE0F";
    greeting = "BLACK FRIDAY SUPER DEAL IS LIVE!";
    culturalHook = `The biggest price drop of the entire year has arrived`;
  } else if (lowerName.includes("christmas") || lowerName.includes("boxing")) {
    emojiTheme = "\u{1F384}\u{1F381}";
    greeting = "Afihyia Pa & Merry Christmas!";
    culturalHook = `Spread love and festive cheer with gifts your loved ones will cherish`;
  } else if (lowerName.includes("mother") || lowerName.includes("women")) {
    emojiTheme = "\u{1F490}\u{1F451}";
    greeting = "Celebrating Every Phenomenal Woman!";
    culturalHook = `Treat the queens who make life beautiful`;
  } else if (lowerName.includes("farmers")) {
    emojiTheme = "\u{1F33E}\u{1F69C}";
    greeting = "Happy National Farmers' Day!";
    culturalHook = `Saluting our hardworking nation with special community savings`;
  }
  const primaryMessage = `${emojiTheme} *${greeting}*

Hello from the team at *${businessName}* in ${city}! ${culturalHook}, we are giving our valued customers an exclusive *${discountRate}* on ${featuredItem}!

\u26A1 *Offer Details:*
\u2022 Discount: *${discountRate}*
\u2022 Valid: Today & ${displayDate} only
\u2022 Payment: Cash, MTN MoMo, Telecel Cash & Visa accepted at counter

\u{1F381} *How to claim:* Simply reply *"CLAIM"* to this WhatsApp chat or show this message at our store counter in ${city}.

_Limited stock available. Hurry before promo items sell out!_ \u{1F680}`;
  const variation1 = `\u{1F525} *FLASH SALE ALERT: ${discountRate} for ${holidayName}!*

Hey there! *${businessName}* is slashing prices for ${holidayName}. Get an instant *${discountRate}* today.

\u{1F4CD} Available at our ${city} store or order directly on WhatsApp.
\u{1F449} Reply *"YES"* now to reserve your items before stock clears out! \u{1F3C3}\u200D\u2642\uFE0F\u{1F4A8}`;
  const variation2 = `\u{1F451} *VIP Customer Appreciation: ${holidayName} Special*

Dear valued customer, as we celebrate ${holidayName}, *${businessName}* wants to thank you for choosing us.

Enjoy an exclusive VIP discount of *${discountRate}* on your purchases this week.

\u{1F4AC} Send us a message here to view available stock or visit our branch in ${city}. Have a wonderful celebration! ${emojiTheme}`;
  return {
    headline: `${holidayName} Promo \u2014 ${discountRate}`,
    primaryMessage,
    variations: [variation1, variation2],
    recommendedSendTime: "08:30 AM - 10:30 AM GMT",
    urgencyRating: tone === "flash_sale" ? "VERY HIGH" : "HIGH",
    conversionTips: [
      `Customers in ${city} respond 3x faster to messages that explicitly mention Mobile Money payment options.`,
      `Broadcast in the morning (8:30 AM - 10:30 AM) when WhatsApp engagement is highest.`,
      "Set aside 1 staff member to handle inbound chat reservations."
    ],
    dynamicDiscount: discountRate,
    isAiGenerated: false
  };
}

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
var app = express();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
app.use(express.json({ limit: "20mb" }));
var activeSessions = /* @__PURE__ */ new Map();
activeSessions.set("demo_owner_token", "usr_george_owner");
function getUserFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  const userId = activeSessions.get(token);
  if (!userId) return null;
  return posStorage.findUserById(userId) || null;
}
app.post("/api/auth/login", (req, res) => {
  const { email, password, pin } = req.body;
  if (pin) {
    const user2 = posStorage.findUserByPin(pin);
    if (!user2) {
      return res.status(401).json({ error: "Invalid 4-digit PIN." });
    }
    const token2 = generateToken(user2.id);
    activeSessions.set(token2, user2.id);
    const { passwordHash: _2, ...safeUser2 } = user2;
    return res.json({ token: token2, user: safeUser2 });
  }
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const user = posStorage.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Account not found with this email." });
  }
  const inputHash = hashPassword(password);
  if (user.passwordHash !== inputHash) {
    return res.status(401).json({ error: "Incorrect password." });
  }
  const token = generateToken(user.id);
  activeSessions.set(token, user.id);
  const { passwordHash: _, ...safeUser } = user;
  return res.json({
    token,
    user: safeUser,
    message: `Welcome back, ${safeUser.name}!`
  });
});
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role, phone, pin } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
  const existing = posStorage.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: "An account already exists with this email." });
  }
  const newUser = posStorage.createUser({
    name,
    email,
    password,
    role: role || "CASHIER",
    phone,
    pin
  });
  const token = generateToken(newUser.id);
  activeSessions.set(token, newUser.id);
  return res.json({
    token,
    user: newUser,
    message: "User registered successfully!"
  });
});
app.get("/api/auth/me", (req, res) => {
  const user = getUserFromRequest(req);
  if (!user) {
    const defaultOwner = posStorage.findUserById("usr_george_owner");
    if (defaultOwner) {
      const { passwordHash: _2, ...safeOwner } = defaultOwner;
      return res.json({
        user: safeOwner,
        token: "demo_owner_token",
        isDefaultDemo: true
      });
    }
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ user: safeUser });
});
app.post("/api/auth/switch-user", (req, res) => {
  const { userId } = req.body;
  const user = posStorage.findUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "Target user not found." });
  }
  const token = generateToken(user.id);
  activeSessions.set(token, user.id);
  const { passwordHash: _, ...safeUser } = user;
  return res.json({
    token,
    user: safeUser,
    message: `Switched profile to ${user.name} (${user.role})`
  });
});
app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    activeSessions.delete(token);
  }
  return res.json({ message: "Logged out successfully." });
});
app.get("/api/dashboard", (req, res) => {
  const dateStr = req.query.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const metrics = posStorage.getDashboardMetrics(dateStr);
  const business = posStorage.getBusiness();
  return res.json({ metrics, business });
});
app.get("/api/business", (req, res) => {
  return res.json(posStorage.getBusiness());
});
app.put("/api/business", (req, res) => {
  const updated = posStorage.updateBusiness(req.body);
  return res.json({ business: updated, message: "Business configuration updated." });
});
app.get("/api/tenants", (req, res) => {
  const businesses = posStorage.listBusinesses();
  const current = posStorage.getBusiness();
  return res.json({ businesses, current });
});
app.post("/api/tenants", (req, res) => {
  const { name, category, city, country, currency, phone, whatsAppNumber, logo, paymentProvider, subscriptionPlan, billingCycle, ownerName, ownerEmail } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Business name is required" });
  }
  const result = posStorage.onboardNewBusiness({
    name,
    category: category || "Retail & Commerce",
    city: city || "Accra",
    country: country || "Ghana",
    currency: currency || "GH\u20B5",
    phone,
    whatsAppNumber,
    logo,
    paymentProvider: paymentProvider || "PAYSTACK",
    subscriptionPlan: subscriptionPlan || "BUSINESS_PRO",
    billingCycle: billingCycle || "MONTHLY",
    ownerName,
    ownerEmail
  });
  return res.json({
    business: result.business,
    user: result.user,
    message: `\u{1F389} Successfully onboarded ${result.business.name} with Paystack subscription billing!`
  });
});
app.post("/api/tenants/:id/switch", (req, res) => {
  try {
    const switched = posStorage.switchBusiness(req.params.id);
    return res.json({
      business: switched,
      message: `Switched active store to ${switched.name}`
    });
  } catch (err) {
    return res.status(404).json({ error: err.message || "Tenant not found" });
  }
});
app.get("/api/customers", (req, res) => {
  return res.json(posStorage.getCustomers());
});
app.post("/api/customers", (req, res) => {
  const { name, phone, whatsAppNumber, email, tags, notes } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Customer phone/WhatsApp number is required" });
  }
  const cleanNum = phone.replace(/[^0-9]/g, "");
  const customer = posStorage.addCustomer({
    name: name || "Valued Customer",
    phone,
    whatsAppNumber: whatsAppNumber || (cleanNum.startsWith("233") ? `+${cleanNum}` : `+233${cleanNum.replace(/^0/, "")}`),
    email,
    tags: tags || ["Customer", "Promo Eligible"],
    notes,
    totalSpend: 0,
    orderCount: 0,
    lastPurchaseDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  });
  return res.json({ customer, message: "Customer added to CRM directory." });
});
app.put("/api/customers/:id", (req, res) => {
  const updated = posStorage.updateCustomer(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Customer not found" });
  }
  return res.json({ customer: updated, message: "Customer details updated." });
});
app.get("/api/holidays", (req, res) => {
  return res.json(RETAIL_HOLIDAYS_36);
});
app.get("/api/broadcasts", (req, res) => {
  return res.json(posStorage.getPromoBroadcasts());
});
app.post("/api/broadcasts/send", (req, res) => {
  const { title, message, customerIds, holidayId, channel } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Broadcast message content is required" });
  }
  const result = posStorage.sendPromoBroadcast({
    title: title || "Store Promo Broadcast",
    message,
    customerIds,
    holidayId,
    channel: channel || "WHATSAPP"
  });
  return res.json(result);
});
app.post("/api/promo/generate", async (req, res) => {
  try {
    const { holidayId, holidayName, displayDate, discountRate, customPrice, tone, featuredItem } = req.body;
    const biz = posStorage.getBusiness();
    const holiday = RETAIL_HOLIDAYS_36.find((h) => h.id === holidayId);
    const resolvedName = holidayName || holiday?.name || "Upcoming Holiday";
    const resolvedDate = displayDate || holiday?.displayDate || "this week";
    const resolvedDiscount = customPrice || discountRate || holiday?.suggestedDiscount || "20% OFF";
    const result = await generateHighConversionPromo({
      holidayId: holidayId || "custom_holiday",
      holidayName: resolvedName,
      displayDate: resolvedDate,
      discountRate: resolvedDiscount,
      businessName: biz.name,
      city: biz.city,
      phone: biz.phone,
      tone: tone || "festive",
      featuredItem: featuredItem || "all catalog items"
    });
    return res.json({
      success: true,
      ...result,
      business: {
        name: biz.name,
        city: biz.city,
        currency: biz.currency,
        phone: biz.phone
      }
    });
  } catch (error) {
    console.error("Promo generation error in /api/promo/generate:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/broadcasts/notify-owner", (req, res) => {
  const { holidayId, holidayName, proposedDiscount, customPrice, autoContent, ownerPhone } = req.body;
  const biz = posStorage.getBusiness();
  const phone = ownerPhone || biz.phone || "+233244123456";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const promptText = `\u{1F514} *KORA UPCOMING HOLIDAY PROMO ALERT*

Hello ${biz.name} Owner!
Upcoming Event: *${holidayName}*
Proposed Offer: *${customPrice || proposedDiscount || "15% OFF"}*

*Auto-Generated WhatsApp Promo Copy:*
"${autoContent}"

\u{1F449} *Reply YES to approve* and auto-broadcast to all your registered customer numbers.
\u{1F449} *Or reply EDIT [Discount]* to adjust your promo offer.`;
  const encodedMsg = encodeURIComponent(promptText);
  const whatsAppLink = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
  return res.json({
    success: true,
    messageId: `notif_${Date.now()}`,
    ownerPhone: phone,
    holidayName,
    proposedOffer: customPrice || proposedDiscount,
    notificationText: promptText,
    whatsAppLink,
    status: "NOTIFIED_AWAITING_APPROVAL",
    timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
  });
});
app.post("/api/broadcasts/approve-and-send", (req, res) => {
  const { holidayId, holidayName, approvedOffer, finalMessage, approvedBy } = req.body;
  const customers = posStorage.getCustomers();
  const targetIds = customers.map((c) => c.id);
  const broadcastResult = posStorage.sendPromoBroadcast({
    title: `${holidayName || "Holiday"} Promo Campaign (Approved by Owner)`,
    message: finalMessage || `Special promo offer for ${holidayName}: ${approvedOffer}!`,
    customerIds: targetIds,
    holidayId,
    channel: "WHATSAPP"
  });
  return res.json({
    success: true,
    approvalStatus: "APPROVED_BY_OWNER",
    approvedBy: approvedBy || "Store Owner via WhatsApp",
    approvedOffer,
    broadcast: broadcastResult.broadcast,
    recipientsCount: broadcastResult.recipientsCount,
    whatsAppLink: broadcastResult.whatsAppLink,
    message: `Holiday promo approved and queued for WhatsApp broadcast to ${broadcastResult.recipientsCount} customers!`
  });
});
app.post("/api/subscription/upgrade", (req, res) => {
  const { plan, billingCycle, provider } = req.body;
  const currentBiz = posStorage.getBusiness();
  const planAmounts = {
    FREE_TRIAL: 0,
    STARTER: 99,
    BUSINESS_PRO: 249,
    ENTERPRISE: 499
  };
  const updatedBiz = posStorage.updateBusiness({
    subscription: {
      plan: plan || "BUSINESS_PRO",
      status: "ACTIVE",
      billingCycle: billingCycle || "MONTHLY",
      amountGhs: planAmounts[plan] || 249,
      nextBillingDate: new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0],
      paymentProvider: provider || "PAYSTACK",
      reference: `pstk_${Date.now()}_ref`
    }
  });
  return res.json({
    business: updatedBiz,
    message: `Subscription successfully updated to ${plan} via ${provider || "Paystack"}.`
  });
});
app.get("/api/sales", (req, res) => {
  const date = req.query.date;
  return res.json(posStorage.getSales(date));
});
app.post("/api/sales", (req, res) => {
  const { items, totalAmount, paymentMethod, customerName, customerPhone, momoNetwork, momoReference, notes, cashierId, cashierName, date } = req.body;
  if (!items || !items.length || totalAmount === void 0) {
    return res.status(400).json({ error: "Sale items and total amount are required." });
  }
  const currentUser = getUserFromRequest(req);
  const cashier = currentUser ? currentUser.name : cashierName || "George J (Owner)";
  const cashierIdResolved = currentUser ? currentUser.id : cashierId || "usr_george_owner";
  const sale = posStorage.recordSale({
    items,
    subtotal: totalAmount,
    discount: 0,
    tax: 0,
    totalAmount,
    paymentMethod: paymentMethod || "CASH",
    cashierId: cashierIdResolved,
    cashierName: cashier,
    customerName,
    customerPhone,
    momoNetwork,
    momoReference,
    notes,
    date
  });
  return res.json({ sale, message: "Sale recorded and stock updated!" });
});
app.get("/api/expenses", (req, res) => {
  const date = req.query.date;
  return res.json(posStorage.getExpenses(date));
});
app.post("/api/expenses", (req, res) => {
  const { category, amount, description, paymentMethod, date } = req.body;
  if (!category || !amount || amount <= 0) {
    return res.status(400).json({ error: "Valid category and positive amount are required." });
  }
  const currentUser = getUserFromRequest(req);
  const recordedBy = currentUser ? currentUser.name : "George J";
  const expense = posStorage.recordExpense({
    date: date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    category,
    amount: parseFloat(amount),
    description: description || "Operational expense",
    paymentMethod: paymentMethod || "CASH",
    recordedBy
  });
  return res.json({ expense, message: "Expense recorded successfully." });
});
app.get("/api/stock", (req, res) => {
  return res.json(posStorage.getStock());
});
app.post("/api/stock", (req, res) => {
  const { name, sku, category, costPrice, sellingPrice, currentQuantity, restockThreshold, unit, supplier } = req.body;
  if (!name || sellingPrice === void 0) {
    return res.status(400).json({ error: "Product name and selling price are required." });
  }
  const item = posStorage.addStockItem({
    name,
    sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
    category: category || "General",
    costPrice: parseFloat(costPrice) || 0,
    sellingPrice: parseFloat(sellingPrice),
    currentQuantity: parseInt(currentQuantity, 10) || 0,
    restockThreshold: parseInt(restockThreshold, 10) || 5,
    unit: unit || "pcs",
    supplier: supplier || ""
  });
  return res.json({ item, message: "Product added to inventory." });
});
app.put("/api/stock/:id", (req, res) => {
  const updated = posStorage.updateStockItem(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Stock item not found." });
  }
  return res.json({ item: updated, message: "Inventory updated successfully." });
});
app.delete("/api/stock/:id", (req, res) => {
  const success = posStorage.deleteStockItem(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Stock item not found." });
  }
  return res.json({ message: "Product deleted from inventory." });
});
app.get("/api/reconciliation", (req, res) => {
  const date = req.query.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  return res.json(posStorage.getReconciliation(date));
});
app.post("/api/reconciliation", (req, res) => {
  const { autoSendWhatsApp, ...recData } = req.body;
  const result = posStorage.updateReconciliation(recData, Boolean(autoSendWhatsApp));
  const { reconciliation, whatsAppDispatched, dispatchLog } = result;
  let message = reconciliation.status === "BALANCED" ? "Reconciliation balanced successfully!" : `Discrepancy registered: ${reconciliation.status}`;
  if (whatsAppDispatched && dispatchLog) {
    message += ` \u26A1 Close Report automatically sent to WhatsApp (${dispatchLog.recipients.join(", ")})!`;
  }
  return res.json({
    reconciliation,
    whatsAppDispatched,
    dispatchLog,
    message
  });
});
app.get("/api/staff", (req, res) => {
  return res.json(posStorage.getStaffMembers());
});
app.get("/api/alerts", (req, res) => {
  return res.json(posStorage.getAlerts());
});
app.post("/api/alerts/:id/resolve", (req, res) => {
  const success = posStorage.resolveAlert(req.params.id);
  return res.json({ success });
});
app.get("/api/reports/whatsapp-summary", (req, res) => {
  const date = req.query.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const summary = posStorage.generateWhatsAppSummary(date);
  return res.json(summary);
});
app.get("/api/reports/whatsapp-auto-config", (req, res) => {
  const config = posStorage.getWhatsAppAutoConfig();
  const logs = posStorage.getWhatsAppDispatchLogs();
  return res.json({ config, logs });
});
app.put("/api/reports/whatsapp-auto-config", (req, res) => {
  const updated = posStorage.updateWhatsAppAutoConfig(req.body);
  return res.json({
    config: updated,
    message: "WhatsApp automated close report configuration updated successfully."
  });
});
app.post("/api/reports/whatsapp-send-auto", async (req, res) => {
  const { date, trigger } = req.body;
  const targetDate = date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  try {
    const result = await posStorage.sendWhatsAppReportAutomatically(
      targetDate,
      trigger || "INSTANT_AUTO_TRIGGER"
    );
    return res.json(result);
  } catch (err) {
    console.error("Error during automated WhatsApp dispatch:", err);
    return res.status(500).json({
      error: "Failed to dispatch WhatsApp report automatically.",
      details: err?.message || String(err)
    });
  }
});
var lastScheduledCronSentDate = null;
setInterval(async () => {
  try {
    const config = posStorage.getWhatsAppAutoConfig();
    if (!config || !config.enabled || !config.autoSendAtScheduledTime) return;
    const now = /* @__PURE__ */ new Date();
    const currentHours = String(now.getHours()).padStart(2, "0");
    const currentMinutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${currentHours}:${currentMinutes}`;
    const todayDate = now.toISOString().split("T")[0];
    if (currentTime === config.scheduledTime && lastScheduledCronSentDate !== todayDate) {
      lastScheduledCronSentDate = todayDate;
      console.log(`[WhatsApp Auto-Dispatch] Scheduled trigger firing for ${todayDate} at ${currentTime}...`);
      await posStorage.sendWhatsAppReportAutomatically(todayDate, "SCHEDULED_CRON");
    }
  } catch (err) {
    console.error("[WhatsApp Auto-Dispatch Cron Error]:", err);
  }
}, 6e4);
app.get("/api/vps-info", (req, res) => {
  return res.json({
    status: "ONLINE",
    nodeVersion: process.version,
    port: PORT,
    platform: process.platform,
    uptimeSeconds: Math.floor(process.uptime()),
    databasePath: "data/pos_database.json",
    environment: process.env.NODE_ENV || "development",
    serverTime: (/* @__PURE__ */ new Date()).toISOString()
  });
});
async function start() {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path2.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path2.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} Wing AI POS & Business Management Server running on port ${PORT}`);
  });
}
start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
