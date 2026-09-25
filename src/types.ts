export type UserRole = 'BUSINESS_OWNER' | 'MANAGER' | 'CASHIER' | 'STAFF';

export interface RolePermissions {
  canViewDashboard: boolean;
  canManageExpenses: boolean;
  canPerformReconciliation: boolean;
  canManagePaymentMethods: boolean;
  canManageStock: boolean;
  canManageStaff: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  token?: string;
  pin?: string;
  permissions?: RolePermissions;
  createdAt: string;
}

export interface WhatsAppAutomationConfig {
  enabled: boolean;
  autoSendOnReconciliation: boolean; // Auto-send when daily register is closed/reconciled
  autoSendAtScheduledTime: boolean; // Auto-send at fixed closing time
  scheduledTime: string; // e.g. "20:00"
  recipients: string[]; // List of phone numbers e.g. ["+233244567890"]
  gatewayMode: 'VPS_GATEWAY_SERVICE' | 'WHATSAPP_CLOUD_API' | 'WEBHOOK';
  webhookUrl?: string;
  apiKey?: string;
  lastDispatchedAt?: string;
  lastDispatchStatus?: 'DELIVERED' | 'SENT' | 'FAILED' | 'IDLE';
  lastDispatchMessageId?: string;
  lastRecipientCount?: number;
}

export interface WhatsAppDispatchLog {
  id: string;
  date: string;
  timestamp: string;
  recipients: string[];
  trigger: 'RECONCILIATION_CLOSE' | 'SCHEDULED_CRON' | 'INSTANT_AUTO_TRIGGER';
  status: 'DELIVERED' | 'SENT' | 'FAILED';
  summaryPreview: string;
  messageId: string;
  latencyMs: number;
}

export type PaymentProvider = 'PAYSTACK' | 'FLUTTERWAVE' | 'HUBTEL' | 'STRIPE';

export type SubscriptionPlan = 'FREE_TRIAL' | 'STARTER' | 'BUSINESS_PRO' | 'ENTERPRISE';

export interface PaymentGatewayConfig {
  provider: PaymentProvider;
  publicKey?: string;
  secretKey?: string;
  testMode: boolean;
  momoEnabled: boolean;
  cardEnabled: boolean;
  paystackVerified?: boolean;
  paystackAccountId?: string;
}

export interface PrinterConfig {
  connectionType: 'BLUETOOTH' | 'WIFI' | 'USB' | 'BROWSER';
  deviceName?: string;
  ipAddress?: string;
  port?: number;
  paperWidth: '58mm' | '80mm';
  isConnected: boolean;
  autoPrintReceipt: boolean;
  autoPrintDailyClose: boolean;
  lastPrintedAt?: string;
}

export interface SubscriptionConfig {
  plan: SubscriptionPlan;
  status: 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED';
  billingCycle: 'MONTHLY' | 'ANNUAL';
  amountGhs: number;
  nextBillingDate: string;
  paymentProvider: PaymentProvider;
  reference?: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  city: string;
  country: string;
  currency: string; // e.g. "GH₵"
  phone: string;
  whatsAppNumber: string;
  taxRate: number; // e.g. 0 or 15%
  logo?: string; // base64 or URL
  whatsAppAutomation?: WhatsAppAutomationConfig;
  paymentGateway?: PaymentGatewayConfig;
  subscription?: SubscriptionConfig;
  printer?: PrinterConfig;
  createdAt?: string;
}

export interface Customer {
  id: string;
  businessId?: string;
  name: string;
  phone: string;
  whatsAppNumber: string;
  email?: string;
  totalSpend: number;
  orderCount: number;
  lastPurchaseDate: string;
  tags: string[]; // e.g. ['VIP', 'Repeat', 'Promo Eligible']
  notes?: string;
  createdAt: string;
}

export interface RetailHoliday {
  id: string;
  name: string;
  date: string; // "MM-DD" or name
  displayDate: string;
  region: 'GHANA' | 'GLOBAL';
  category: 'CULTURAL' | 'COMMERCIAL' | 'NATIONAL' | 'FESTIVE';
  suggestedDiscount: string; // e.g. "15% OFF"
  promoHeadline: string;
  promoTemplate: string;
}

export interface PromoBroadcast {
  id: string;
  title: string;
  message: string;
  recipientsCount: number;
  channel: 'WHATSAPP' | 'SMS';
  holidayId?: string;
  timestamp: string;
  status: 'DELIVERED' | 'SCHEDULED';
}

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  currentQuantity: number;
  restockThreshold: number;
  unit: string; // 'pcs', 'pack', 'kg', 'bottle'
  supplier?: string;
  updatedAt: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PaymentMethod = 'CASH' | 'MOMO' | 'CARD' | 'SPLIT';

export interface Sale {
  id: string;
  receiptNumber: string;
  date: string; // YYYY-MM-DD
  time: string;
  cashierId: string;
  cashierName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  momoNetwork?: 'MTN' | 'Telecel/Vodafone' | 'AT' | 'Other';
  momoReference?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  category: 'Stock/Inventory' | 'Rent' | 'Utilities' | 'Transport' | 'Staff Pay' | 'Packaging' | 'Maintenance' | 'Other';
  amount: number;
  description: string;
  paymentMethod: PaymentMethod;
  recordedBy: string;
}

export interface DailyReconciliation {
  id: string;
  date: string; // YYYY-MM-DD
  expectedSalesCash: number;
  expectedSalesMomo: number;
  expectedSalesCard: number;
  expectedTotal: number;
  countedCash: number;
  countedMomo: number;
  countedCard: number;
  countedTotal: number;
  variance: number; // Counted - Expected (negative = leakage/shortage)
  status: 'BALANCED' | 'SURPLUS' | 'SHORTAGE';
  notes?: string;
  reconciledBy: string;
  updatedAt: string;
}

export interface AlertNotification {
  id: string;
  type: 'LOW_STOCK' | 'LEAKAGE_VARIANCE' | 'HIGH_EXPENSE' | 'MILESTONE';
  title: string;
  message: string;
  severity: 'low' | 'warning' | 'critical';
  date: string;
  resolved: boolean;
  actionPath?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  pin: string;
  permissions?: RolePermissions;
  status: 'ACTIVE' | 'INACTIVE';
  totalSalesCount: number;
  totalSalesRevenue: number;
}

export interface DashboardMetrics {
  selectedDate: string;
  todaySales: number;
  transactionCount: number;
  todayExpenses: number;
  estimatedProfit: number;
  reconciliation: {
    status: 'Balanced' | 'Discrepancy';
    variance: number;
    expectedRevenue: number;
    countedActual: number;
  };
  lowStockCount: number;
  lowStockItems: StockItem[];
}
