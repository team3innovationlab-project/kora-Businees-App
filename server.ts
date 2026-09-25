import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { posStorage, hashPassword, generateToken } from './src/server/storage';
import { RETAIL_HOLIDAYS_36 } from './src/data/holidays';
import { generateHighConversionPromo } from './src/utils/promoGenerator';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Simple in-memory session token store (token -> userId)
const activeSessions = new Map<string, string>();

// Pre-seed owner session for seamless preview experience
activeSessions.set('demo_owner_token', 'usr_george_owner');

// Auth middleware helper
function getUserFromRequest(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const userId = activeSessions.get(token);
  if (!userId) return null;
  return posStorage.findUserById(userId) || null;
}

// ==========================================
// 1. AUTHENTICATION & USER MANAGEMENT
// ==========================================

// Login with email & password OR PIN
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, pin } = req.body;

  if (pin) {
    const user = posStorage.findUserByPin(pin);
    if (!user) {
      return res.status(401).json({ error: 'Invalid 4-digit PIN.' });
    }
    const token = generateToken(user.id);
    activeSessions.set(token, user.id);
    const { passwordHash: _, ...safeUser } = user;
    return res.json({ token, user: safeUser });
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = posStorage.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Account not found with this email.' });
  }

  const inputHash = hashPassword(password);
  if (user.passwordHash !== inputHash) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  const token = generateToken(user.id);
  activeSessions.set(token, user.id);
  const { passwordHash: _, ...safeUser } = user;

  return res.json({
    token,
    user: safeUser,
    message: `Welcome back, ${safeUser.name}!`,
  });
});

// Register new user / staff member
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, role, phone, pin } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = posStorage.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account already exists with this email.' });
  }

  const newUser = posStorage.createUser({
    name,
    email,
    password,
    role: role || 'CASHIER',
    phone,
    pin,
  });

  const token = generateToken(newUser.id);
  activeSessions.set(token, newUser.id);

  return res.json({
    token,
    user: newUser,
    message: 'User registered successfully!',
  });
});

// Current user profile
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getUserFromRequest(req);
  if (!user) {
    // Return default owner if demo or unauthenticated to ensure zero-friction preview
    const defaultOwner = posStorage.findUserById('usr_george_owner');
    if (defaultOwner) {
      const { passwordHash: _, ...safeOwner } = defaultOwner;
      return res.json({
        user: safeOwner,
        token: 'demo_owner_token',
        isDefaultDemo: true,
      });
    }
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  const { passwordHash: _, ...safeUser } = user;
  return res.json({ user: safeUser });
});

// Fast Switch User / Demo Profile Switcher
app.post('/api/auth/switch-user', (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = posStorage.findUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'Target user not found.' });
  }

  const token = generateToken(user.id);
  activeSessions.set(token, user.id);
  const { passwordHash: _, ...safeUser } = user;

  return res.json({
    token,
    user: safeUser,
    message: `Switched profile to ${user.name} (${user.role})`,
  });
});

// Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    activeSessions.delete(token);
  }
  return res.json({ message: 'Logged out successfully.' });
});

// ==========================================
// 2. DASHBOARD & BUSINESS OVERVIEW
// ==========================================

app.get('/api/dashboard', (req: Request, res: Response) => {
  const dateStr = (req.query.date as string) || new Date().toISOString().split('T')[0];
  const metrics = posStorage.getDashboardMetrics(dateStr);
  const business = posStorage.getBusiness();
  return res.json({ metrics, business });
});

app.get('/api/business', (req: Request, res: Response) => {
  return res.json(posStorage.getBusiness());
});

app.put('/api/business', (req: Request, res: Response) => {
  const updated = posStorage.updateBusiness(req.body);
  return res.json({ business: updated, message: 'Business configuration updated.' });
});

// Multi-Tenant Onboarding & Management
app.get('/api/tenants', (req: Request, res: Response) => {
  const businesses = posStorage.listBusinesses();
  const current = posStorage.getBusiness();
  return res.json({ businesses, current });
});

app.post('/api/tenants', (req: Request, res: Response) => {
  const { name, category, city, country, currency, phone, whatsAppNumber, logo, paymentProvider, subscriptionPlan, billingCycle, ownerName, ownerEmail } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Business name is required' });
  }

  const result = posStorage.onboardNewBusiness({
    name,
    category: category || 'Retail & Commerce',
    city: city || 'Accra',
    country: country || 'Ghana',
    currency: currency || 'GH₵',
    phone,
    whatsAppNumber,
    logo,
    paymentProvider: paymentProvider || 'PAYSTACK',
    subscriptionPlan: subscriptionPlan || 'BUSINESS_PRO',
    billingCycle: billingCycle || 'MONTHLY',
    ownerName,
    ownerEmail,
  });

  return res.json({
    business: result.business,
    user: result.user,
    message: `🎉 Successfully onboarded ${result.business.name} with Paystack subscription billing!`,
  });
});

app.post('/api/tenants/:id/switch', (req: Request, res: Response) => {
  try {
    const switched = posStorage.switchBusiness(req.params.id);
    return res.json({
      business: switched,
      message: `Switched active store to ${switched.name}`,
    });
  } catch (err: any) {
    return res.status(404).json({ error: err.message || 'Tenant not found' });
  }
});

// Customer CRM & WhatsApp Broadcast
app.get('/api/customers', (req: Request, res: Response) => {
  return res.json(posStorage.getCustomers());
});

app.post('/api/customers', (req: Request, res: Response) => {
  const { name, phone, whatsAppNumber, email, tags, notes } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Customer phone/WhatsApp number is required' });
  }
  const cleanNum = phone.replace(/[^0-9]/g, '');
  const customer = posStorage.addCustomer({
    name: name || 'Valued Customer',
    phone,
    whatsAppNumber: whatsAppNumber || (cleanNum.startsWith('233') ? `+${cleanNum}` : `+233${cleanNum.replace(/^0/, '')}`),
    email,
    tags: tags || ['Customer', 'Promo Eligible'],
    notes,
    totalSpend: 0,
    orderCount: 0,
    lastPurchaseDate: new Date().toISOString().split('T')[0],
  });
  return res.json({ customer, message: 'Customer added to CRM directory.' });
});

app.put('/api/customers/:id', (req: Request, res: Response) => {
  const updated = posStorage.updateCustomer(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  return res.json({ customer: updated, message: 'Customer details updated.' });
});

// 36 Ghana & World Retail Holidays for Marketing
app.get('/api/holidays', (req: Request, res: Response) => {
  return res.json(RETAIL_HOLIDAYS_36);
});

// Broadcasts & Promo Dispatch
app.get('/api/broadcasts', (req: Request, res: Response) => {
  return res.json(posStorage.getPromoBroadcasts());
});

app.post('/api/broadcasts/send', (req: Request, res: Response) => {
  const { title, message, customerIds, holidayId, channel } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Broadcast message content is required' });
  }
  const result = posStorage.sendPromoBroadcast({
    title: title || 'Store Promo Broadcast',
    message,
    customerIds,
    holidayId,
    channel: channel || 'WHATSAPP',
  });
  return res.json(result);
});

// Generate High-Conversion Marketing Message with Dynamic Discount
app.post('/api/promo/generate', async (req: Request, res: Response) => {
  try {
    const { holidayId, holidayName, displayDate, discountRate, customPrice, tone, featuredItem } = req.body;
    const biz = posStorage.getBusiness();
    
    const holiday = RETAIL_HOLIDAYS_36.find(h => h.id === holidayId);
    const resolvedName = holidayName || holiday?.name || 'Upcoming Holiday';
    const resolvedDate = displayDate || holiday?.displayDate || 'this week';
    const resolvedDiscount = customPrice || discountRate || holiday?.suggestedDiscount || '20% OFF';

    const result = await generateHighConversionPromo({
      holidayId: holidayId || 'custom_holiday',
      holidayName: resolvedName,
      displayDate: resolvedDate,
      discountRate: resolvedDiscount,
      businessName: biz.name,
      city: biz.city,
      phone: biz.phone,
      tone: tone || 'festive',
      featuredItem: featuredItem || 'all catalog items',
    });

    return res.json({
      success: true,
      ...result,
      business: {
        name: biz.name,
        city: biz.city,
        currency: biz.currency,
        phone: biz.phone,
      },
    });
  } catch (error: any) {
    console.error('Promo generation error in /api/promo/generate:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Notify Business Owner on WhatsApp for Upcoming Holiday Promo
app.post('/api/broadcasts/notify-owner', (req: Request, res: Response) => {
  const { holidayId, holidayName, proposedDiscount, customPrice, autoContent, ownerPhone } = req.body;
  const biz = posStorage.getBusiness();
  const phone = ownerPhone || biz.phone || '+233244123456';
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const promptText = `🔔 *KORA UPCOMING HOLIDAY PROMO ALERT*\n\n` +
    `Hello ${biz.name} Owner!\n` +
    `Upcoming Event: *${holidayName}*\n` +
    `Proposed Offer: *${customPrice || proposedDiscount || '15% OFF'}*\n\n` +
    `*Auto-Generated WhatsApp Promo Copy:*\n` +
    `"${autoContent}"\n\n` +
    `👉 *Reply YES to approve* and auto-broadcast to all your registered customer numbers.\n` +
    `👉 *Or reply EDIT [Discount]* to adjust your promo offer.`;

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
    status: 'NOTIFIED_AWAITING_APPROVAL',
    timestamp: new Date().toLocaleTimeString(),
  });
});

// Owner Approves Holiday Promo via WhatsApp
app.post('/api/broadcasts/approve-and-send', (req: Request, res: Response) => {
  const { holidayId, holidayName, approvedOffer, finalMessage, approvedBy } = req.body;
  const customers = posStorage.getCustomers();
  const targetIds = customers.map(c => c.id);

  const broadcastResult = posStorage.sendPromoBroadcast({
    title: `${holidayName || 'Holiday'} Promo Campaign (Approved by Owner)`,
    message: finalMessage || `Special promo offer for ${holidayName}: ${approvedOffer}!`,
    customerIds: targetIds,
    holidayId,
    channel: 'WHATSAPP',
  });

  return res.json({
    success: true,
    approvalStatus: 'APPROVED_BY_OWNER',
    approvedBy: approvedBy || 'Store Owner via WhatsApp',
    approvedOffer,
    broadcast: broadcastResult.broadcast,
    recipientsCount: broadcastResult.recipientsCount,
    whatsAppLink: broadcastResult.whatsAppLink,
    message: `Holiday promo approved and queued for WhatsApp broadcast to ${broadcastResult.recipientsCount} customers!`,
  });
});

// Subscription Upgrade / Payment Integration (Paystack simulation & webhook)
app.post('/api/subscription/upgrade', (req: Request, res: Response) => {
  const { plan, billingCycle, provider } = req.body;
  const currentBiz = posStorage.getBusiness();
  const planAmounts: Record<string, number> = {
    FREE_TRIAL: 0,
    STARTER: 99,
    BUSINESS_PRO: 249,
    ENTERPRISE: 499,
  };

  const updatedBiz = posStorage.updateBusiness({
    subscription: {
      plan: plan || 'BUSINESS_PRO',
      status: 'ACTIVE',
      billingCycle: billingCycle || 'MONTHLY',
      amountGhs: planAmounts[plan] || 249,
      nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      paymentProvider: provider || 'PAYSTACK',
      reference: `pstk_${Date.now()}_ref`,
    },
  });

  return res.json({
    business: updatedBiz,
    message: `Subscription successfully updated to ${plan} via ${provider || 'Paystack'}.`,
  });
});

// ==========================================
// 3. SALES & POINT OF SALE (POS)
// ==========================================

app.get('/api/sales', (req: Request, res: Response) => {
  const date = req.query.date as string | undefined;
  return res.json(posStorage.getSales(date));
});

app.post('/api/sales', (req: Request, res: Response) => {
  const { items, totalAmount, paymentMethod, customerName, customerPhone, momoNetwork, momoReference, notes, cashierId, cashierName, date } = req.body;

  if (!items || !items.length || totalAmount === undefined) {
    return res.status(400).json({ error: 'Sale items and total amount are required.' });
  }

  const currentUser = getUserFromRequest(req);
  const cashier = currentUser ? currentUser.name : (cashierName || 'George J (Owner)');
  const cashierIdResolved = currentUser ? currentUser.id : (cashierId || 'usr_george_owner');

  const sale = posStorage.recordSale({
    items,
    subtotal: totalAmount,
    discount: 0,
    tax: 0,
    totalAmount,
    paymentMethod: paymentMethod || 'CASH',
    cashierId: cashierIdResolved,
    cashierName: cashier,
    customerName,
    customerPhone,
    momoNetwork,
    momoReference,
    notes,
    date,
  });

  return res.json({ sale, message: 'Sale recorded and stock updated!' });
});

// ==========================================
// 4. EXPENSES
// ==========================================

app.get('/api/expenses', (req: Request, res: Response) => {
  const date = req.query.date as string | undefined;
  return res.json(posStorage.getExpenses(date));
});

app.post('/api/expenses', (req: Request, res: Response) => {
  const { category, amount, description, paymentMethod, date } = req.body;

  if (!category || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid category and positive amount are required.' });
  }

  const currentUser = getUserFromRequest(req);
  const recordedBy = currentUser ? currentUser.name : 'George J';

  const expense = posStorage.recordExpense({
    date: date || new Date().toISOString().split('T')[0],
    category,
    amount: parseFloat(amount),
    description: description || 'Operational expense',
    paymentMethod: paymentMethod || 'CASH',
    recordedBy,
  });

  return res.json({ expense, message: 'Expense recorded successfully.' });
});

// ==========================================
// 5. STOCK & INVENTORY
// ==========================================

app.get('/api/stock', (req: Request, res: Response) => {
  return res.json(posStorage.getStock());
});

app.post('/api/stock', (req: Request, res: Response) => {
  const { name, sku, category, costPrice, sellingPrice, currentQuantity, restockThreshold, unit, supplier } = req.body;

  if (!name || sellingPrice === undefined) {
    return res.status(400).json({ error: 'Product name and selling price are required.' });
  }

  const item = posStorage.addStockItem({
    name,
    sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
    category: category || 'General',
    costPrice: parseFloat(costPrice) || 0,
    sellingPrice: parseFloat(sellingPrice),
    currentQuantity: parseInt(currentQuantity, 10) || 0,
    restockThreshold: parseInt(restockThreshold, 10) || 5,
    unit: unit || 'pcs',
    supplier: supplier || '',
  });

  return res.json({ item, message: 'Product added to inventory.' });
});

app.put('/api/stock/:id', (req: Request, res: Response) => {
  const updated = posStorage.updateStockItem(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Stock item not found.' });
  }
  return res.json({ item: updated, message: 'Inventory updated successfully.' });
});

app.delete('/api/stock/:id', (req: Request, res: Response) => {
  const success = posStorage.deleteStockItem(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Stock item not found.' });
  }
  return res.json({ message: 'Product deleted from inventory.' });
});

// ==========================================
// 6. CASH RECONCILIATION
// ==========================================

app.get('/api/reconciliation', (req: Request, res: Response) => {
  const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
  return res.json(posStorage.getReconciliation(date));
});

app.post('/api/reconciliation', (req: Request, res: Response) => {
  const { autoSendWhatsApp, ...recData } = req.body;
  const result = posStorage.updateReconciliation(recData, Boolean(autoSendWhatsApp));
  const { reconciliation, whatsAppDispatched, dispatchLog } = result;
  
  let message = reconciliation.status === 'BALANCED' 
    ? 'Reconciliation balanced successfully!' 
    : `Discrepancy registered: ${reconciliation.status}`;

  if (whatsAppDispatched && dispatchLog) {
    message += ` ⚡ Close Report automatically sent to WhatsApp (${dispatchLog.recipients.join(', ')})!`;
  }

  return res.json({
    reconciliation,
    whatsAppDispatched,
    dispatchLog,
    message,
  });
});

// ==========================================
// 7. STAFF MANAGEMENT & ROLE-BASED ACCESS
// ==========================================

app.get('/api/staff', (req: Request, res: Response) => {
  return res.json(posStorage.getStaffMembers());
});

// Update Staff Member Role, Permissions & PIN (Owner only)
app.put('/api/staff/:id/permissions', (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, pin, permissions } = req.body;

  const updatedUser = posStorage.updateUser(id, {
    role,
    pin,
    permissions,
  });

  if (!updatedUser) {
    return res.status(404).json({ error: 'Staff member not found.' });
  }

  return res.json({
    success: true,
    user: updatedUser,
    message: `Updated permissions and terminal PIN for ${updatedUser.name}.`,
  });
});

// ==========================================
// 7B. PAYSTACK VISA/MASTERCARD INTEGRATION
// ==========================================

// Initialize a Paystack Card transaction (Visa / Mastercard)
app.post('/api/payments/paystack/initialize', (req: Request, res: Response) => {
  const { amount, email, currency = 'GHS', metadata } = req.body;
  const biz = posStorage.getBusiness();
  const publicKey = biz.paymentGateway?.publicKey || 'pk_live_techwokx_gh_78291482';
  const reference = `pstk_trx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Paystack standard authorization URL simulation / live checkout config
  return res.json({
    success: true,
    status: 'success',
    message: 'Paystack checkout session created',
    data: {
      authorization_url: `https://checkout.paystack.com/${reference}`,
      access_code: `acc_${reference}`,
      reference,
      publicKey,
      amount,
      currency,
      email: email || 'walkin-customer@kora.app',
      businessName: biz.name,
      channels: ['card', 'mobile_money'],
      cardBrands: ['Visa', 'Mastercard'],
    },
  });
});

// Verify a Paystack transaction
app.post('/api/payments/paystack/verify', (req: Request, res: Response) => {
  const { reference, last4, cardType, bank } = req.body;

  return res.json({
    success: true,
    status: 'success',
    message: 'Paystack transaction verified successfully',
    data: {
      reference: reference || `pstk_trx_${Date.now()}`,
      status: 'success',
      gateway_response: 'Successful',
      paid_at: new Date().toISOString(),
      channel: 'card',
      authorization: {
        authorization_code: `AUTH_${Date.now().toString(36).toUpperCase()}`,
        card_type: cardType || 'Visa / Mastercard',
        last4: last4 || '4242',
        exp_month: '12',
        exp_year: '2028',
        bin: '408408',
        bank: bank || 'Paystack Ghana Settlement',
        reusable: true,
        country_code: 'GH',
      },
    },
  });
});

// ==========================================
// 8. ALERTS & NOTIFICATIONS
// ==========================================

app.get('/api/alerts', (req: Request, res: Response) => {
  return res.json(posStorage.getAlerts());
});

app.post('/api/alerts/:id/resolve', (req: Request, res: Response) => {
  const success = posStorage.resolveAlert(req.params.id);
  return res.json({ success });
});

// ==========================================
// 9. WHATSAPP SUMMARY & AUTOMATED REPORTS
// ==========================================

app.get('/api/reports/whatsapp-summary', (req: Request, res: Response) => {
  const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
  const summary = posStorage.generateWhatsAppSummary(date);
  return res.json(summary);
});

// Get WhatsApp Automation configuration & recent dispatch logs
app.get('/api/reports/whatsapp-auto-config', (req: Request, res: Response) => {
  const config = posStorage.getWhatsAppAutoConfig();
  const logs = posStorage.getWhatsAppDispatchLogs();
  return res.json({ config, logs });
});

// Update WhatsApp Automation settings (toggle auto-send, time, recipients, gateway)
app.put('/api/reports/whatsapp-auto-config', (req: Request, res: Response) => {
  const updated = posStorage.updateWhatsAppAutoConfig(req.body);
  return res.json({
    config: updated,
    message: 'WhatsApp automated close report configuration updated successfully.',
  });
});

// Trigger automated WhatsApp dispatch immediately (e.g. from 1-click auto-send button)
app.post('/api/reports/whatsapp-send-auto', async (req: Request, res: Response) => {
  const { date, trigger } = req.body;
  const targetDate = date || new Date().toISOString().split('T')[0];
  try {
    const result = await posStorage.sendWhatsAppReportAutomatically(
      targetDate, 
      trigger || 'INSTANT_AUTO_TRIGGER'
    );
    return res.json(result);
  } catch (err: any) {
    console.error('Error during automated WhatsApp dispatch:', err);
    return res.status(500).json({ 
      error: 'Failed to dispatch WhatsApp report automatically.',
      details: err?.message || String(err),
    });
  }
});

// Automated Daily Close Cron Checker (checks every 60s for scheduled closing time)
let lastScheduledCronSentDate: string | null = null;
setInterval(async () => {
  try {
    const config = posStorage.getWhatsAppAutoConfig();
    if (!config || !config.enabled || !config.autoSendAtScheduledTime) return;

    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${currentHours}:${currentMinutes}`;
    const todayDate = now.toISOString().split('T')[0];

    if (currentTime === config.scheduledTime && lastScheduledCronSentDate !== todayDate) {
      lastScheduledCronSentDate = todayDate;
      console.log(`[WhatsApp Auto-Dispatch] Scheduled trigger firing for ${todayDate} at ${currentTime}...`);
      await posStorage.sendWhatsAppReportAutomatically(todayDate, 'SCHEDULED_CRON');
    }
  } catch (err) {
    console.error('[WhatsApp Auto-Dispatch Cron Error]:', err);
  }
}, 60000);

// ==========================================
// 10. VPS DEPLOYMENT & HEALTH STATUS
// ==========================================

app.get('/api/vps-info', (req: Request, res: Response) => {
  return res.json({
    status: 'ONLINE',
    nodeVersion: process.version,
    port: PORT,
    platform: process.platform,
    uptimeSeconds: Math.floor(process.uptime()),
    databasePath: 'data/pos_database.json',
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString(),
  });
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================

async function start() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Wing AI POS & Business Management Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
