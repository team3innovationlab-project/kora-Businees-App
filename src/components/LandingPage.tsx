import React, { useState } from 'react';
import { 
  Building2, 
  Store, 
  Share2, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Smartphone, 
  CreditCard, 
  Banknote, 
  Boxes, 
  Scale, 
  Megaphone, 
  Download, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  Zap, 
  Star, 
  Calendar, 
  CheckCircle2, 
  Server,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { BusinessProfile, SubscriptionPlan } from '../types';

interface LandingPageProps {
  business: BusinessProfile;
  onNavigateToOnboarding: (plan?: SubscriptionPlan) => void;
  onNavigateToLogin: () => void;
  onNavigateToApp: () => void;
  onOpenVpsGuide: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  business,
  onNavigateToOnboarding,
  onNavigateToLogin,
  onNavigateToApp,
  onOpenVpsGuide,
}) => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [activeFeatureTab, setActiveFeatureTab] = useState<'whatsapp' | 'pos' | 'holidays' | 'accounting'>('whatsapp');
  const [dailySalesEstimate, setDailySalesEstimate] = useState<number>(3500);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Projected savings calculation
  const monthlyRevenue = dailySalesEstimate * 30;
  const estimatedLeakagePrevented = Math.round(monthlyRevenue * 0.035); // 3.5% average retail shrinkage prevented

  const plans = [
    {
      id: 'FREE_TRIAL' as SubscriptionPlan,
      name: 'Free Trial',
      description: 'Ideal for trying out the POS register and automated WhatsApp reports.',
      monthlyPrice: 'GH₵ 0',
      annualPrice: 'GH₵ 0',
      period: 'for 14 days',
      features: [
        'Single POS register terminal',
        'Daily WhatsApp close reports (manual & auto)',
        'Inventory stock tracking & alerts',
        'Sales & expenses CSV export',
        'Community support',
      ],
      cta: 'Start Free 14-Day Trial',
      popular: false,
    },
    {
      id: 'STARTER' as SubscriptionPlan,
      name: 'Starter',
      description: 'Perfect for single-location kiosks, boutiques, and pharmacies.',
      monthlyPrice: 'GH₵ 99',
      annualPrice: 'GH₵ 79',
      period: '/ month',
      features: [
        'Up to 3 cashier / staff accounts',
        'Automated scheduled WhatsApp daily reports',
        'Mobile Money (MTN, Telecel, AT) support',
        'Stock low-inventory restock alerts',
        'Customer phone number logging',
        'Accounting CSV downloads',
      ],
      cta: 'Select Starter Plan',
      popular: false,
    },
    {
      id: 'BUSINESS_PRO' as SubscriptionPlan,
      name: 'Business Pro',
      description: 'Our most popular plan for busy retail shops, marts, and electronic stores.',
      monthlyPrice: 'GH₵ 249',
      annualPrice: 'GH₵ 199',
      period: '/ month',
      features: [
        'Unlimited staff & cashier user accounts',
        '36 Ghana & World holiday promo campaigns',
        'Automated WhatsApp broadcast & customer CRM',
        'Paystack MoMo & card payment integration',
        'End-of-day register variance detection',
        'Detailed sales & expense accounting exports',
        'Priority technical support',
      ],
      cta: 'Start with Business Pro',
      popular: true,
    },
    {
      id: 'ENTERPRISE' as SubscriptionPlan,
      name: 'Enterprise Multi-Store',
      description: 'Designed for supermarkets, multi-branch retailers, and growing chains.',
      monthlyPrice: 'GH₵ 499',
      annualPrice: 'GH₵ 399',
      period: '/ month',
      features: [
        'Multi-tenant store & branch management',
        'Centralized inventory across all branches',
        'Self-hosted VPS deployment assistance',
        'Custom webhooks & WhatsApp Cloud API',
        'Dedicated account manager & SLA',
        'Custom report schemas & branding',
      ],
      cta: 'Choose Enterprise',
      popular: false,
    },
  ];

  const faqs = [
    {
      q: 'How do the automatic WhatsApp Daily Close Reports work?',
      a: 'Every day when your store manager or cashier closes and balances the register, the system automatically formats a comprehensive summary of today’s total sales, cash collected, Mobile Money settlements, expenses, and net cash flow. It dispatches this report directly to the business owner’s WhatsApp phone number without requiring any manual typing.',
    },
    {
      q: 'Can our sales cashiers accept MTN and Telecel Mobile Money at the register?',
      a: 'Yes! The POS register has integrated support for Mobile Money (MTN MoMo, Telecel Cash, AT Money) with prompt references, cash payments, Visa/Mastercard card settlements, and split payments. All transactions are logged and reconciled automatically.',
    },
    {
      q: 'What is the 36 Ghana & World Holidays Promo feature?',
      a: 'We have pre-programmed 36 statutory and commercial retail holidays (such as 6th March Independence Day, Easter, Eid al-Fitr, Workers’ Day, Farmers’ Day, Black Friday, and Christmas). Each holiday includes ready-to-send promotional WhatsApp copy with suggested discount offers that you can broadcast to your logged customer list with one click.',
    },
    {
      q: 'Can this platform be deployed to our own VPS server or cloud?',
      a: 'Yes! The app is built with a Node.js Express backend and SQLite/JSON persistent store, making it 100% self-hostable on Ubuntu/Debian VPS providers (like DigitalOcean, Linode, AWS, Hetzner, or Contabo) using Docker, PM2, and Nginx reverse proxy with SSL.',
    },
    {
      q: 'Can I export our sales and inventory data for our accountant or tax filing?',
      a: 'Absolutely. In one click, you can export full transaction spreadsheets, expense ledgers, product inventory logs, and customer CRM records to standard CSV files compatible with Microsoft Excel, Google Sheets, QuickBooks, and GRA tax reporting.',
    },
    {
      q: 'Is it easy to onboard multiple branches or separate businesses?',
      a: 'Yes. Wing POS is built from the ground up as a multi-tenant platform. You can onboard additional stores in under two minutes, each with its own logo, currency, staff, and Paystack gateway settings.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#08151c] text-slate-100 selection:bg-emerald-500 selection:text-white font-sans antialiased">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-[#08151c]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block leading-tight">
                Wing POS
              </span>
              <span className="text-[11px] text-slate-400 block font-medium">
                Retail Management & WhatsApp Automation
              </span>
            </div>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#whatsapp" className="hover:text-emerald-400 transition-colors">WhatsApp Reports</a>
            <a href="#holidays" className="hover:text-emerald-400 transition-colors">36 Holidays Promo</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing & Plans</a>
            <a href="#calculator" className="hover:text-emerald-400 transition-colors">ROI Calculator</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onNavigateToLogin}
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-700/80 hover:border-slate-500 transition-all cursor-pointer"
            >
              Business Login
            </button>

            <button
              onClick={() => onNavigateToOnboarding('BUSINESS_PRO')}
              className="text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-400/20 cursor-pointer flex items-center gap-1.5"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 lg:px-8 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          {/* Editorial Kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span>The Modern Retail Operating System for West Africa</span>
            <span aria-hidden="true">·</span>
            <span>Paystack MoMo & WhatsApp Enabled</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Run Your Retail Store With Automatic WhatsApp Close Reports & Fast POS
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate register cash leakage, accept Mobile Money in seconds, broadcast 36 Ghana holiday promos, and receive automated financial close reports straight to your phone.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToOnboarding('BUSINESS_PRO')}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-lg shadow-emerald-500/25 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToApp}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-2xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Explore Live POS Demo</span>
            </button>
          </div>

          {/* Trust proof bar */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Paystack & Mobile Money Ready</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Deploy on Your Own VPS</span>
            </div>
          </div>
        </div>

        {/* HERO INTERACTIVE SHOWCASE (Side-by-Side Live UI) */}
        <div className="max-w-6xl mx-auto mt-12 sm:mt-16 relative z-10">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="font-mono text-[11px] text-slate-400 ml-2">
                  pos.wing.app · Live Store Instance: {business.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold text-[11px]">
                  ● Register Online & Synced
                </span>
                <button
                  onClick={onNavigateToApp}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Enter Live App
                </button>
              </div>
            </div>

            {/* Two Column Layout: POS Register View (Left) & Automated WhatsApp Report (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: POS Terminal Snapshot */}
              <div className="lg:col-span-7 bg-[#0b1c24] border border-[#163647] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-sm text-white">{business.name} Register</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    MoMo & Cash Active
                  </span>
                </div>

                {/* Sample Cart breakdown */}
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400 font-bold pb-1 border-b border-slate-800 text-[11px]">
                    <span>Item</span>
                    <span>Qty</span>
                    <span>Total</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="font-medium">Wireless Noise-Canceling Earbuds</span>
                    <span className="font-mono text-slate-400">x1</span>
                    <span className="font-bold text-white">GH₵ 420.00</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="font-medium">65W GaN Fast Wall Charger</span>
                    <span className="font-mono text-slate-400">x2</span>
                    <span className="font-bold text-white">GH₵ 360.00</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="font-medium">Braided Type-C Fast Cable</span>
                    <span className="font-mono text-slate-400">x1</span>
                    <span className="font-bold text-white">GH₵ 75.00</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">Total Charged:</span>
                    <span className="text-emerald-400 text-sm font-black">GH₵ 855.00</span>
                  </div>
                </div>

                {/* Payment Methods Bar */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-center">
                  <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl p-2">
                    <Smartphone className="w-3.5 h-3.5 mx-auto mb-0.5 text-emerald-400" />
                    <span>MTN MoMo</span>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700 text-slate-300 rounded-xl p-2">
                    <Banknote className="w-3.5 h-3.5 mx-auto mb-0.5 text-slate-400" />
                    <span>Cash</span>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700 text-slate-300 rounded-xl p-2">
                    <CreditCard className="w-3.5 h-3.5 mx-auto mb-0.5 text-slate-400" />
                    <span>Visa / Card</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Simulated WhatsApp Daily Close Report */}
              <div className="lg:col-span-5 bg-[#0b141a] border border-[#1f2c34] rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  {/* WhatsApp chat top bar */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[#222d34] mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white font-bold text-xs">
                      WA
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">
                        Wing POS Dispatch Bot
                      </span>
                      <span className="text-[10px] text-emerald-400">
                        Delivered to Owner ({business.whatsAppNumber || '+233 24 456 7890'})
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Message Bubble */}
                  <div className="bg-[#1f2c34] text-slate-100 rounded-2xl rounded-tl-none p-3.5 text-[11px] leading-relaxed font-mono space-y-1.5 shadow-md border border-[#2a3942]">
                    <div className="font-bold text-emerald-400 text-xs">
                      📊 {business.name.toUpperCase()} - DAILY CLOSE REPORT
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      📅 Date: Today · Closed by: Manager Abena
                    </div>
                    <div className="border-t border-[#2a3942] my-1"></div>
                    <div>💰 TODAY'S TOTAL SALES: <strong className="text-white">GH₵ 3,840.00</strong></div>
                    <div>🧾 Transactions: <span className="text-slate-300">24 orders</span></div>
                    <div>💵 Cash Collected: <span className="text-slate-300">GH₵ 1,420.00</span></div>
                    <div>📱 Mobile Money (MTN/Telecel): <span className="text-emerald-400 font-bold">GH₵ 2,120.00</span></div>
                    <div>💳 Card Settlements: <span className="text-slate-300">GH₵ 300.00</span></div>
                    <div className="border-t border-[#2a3942] my-1"></div>
                    <div>📉 Expenses Recorded: <span className="text-amber-400">GH₵ 410.00</span></div>
                    <div>⚖️ Register Variance: <strong className="text-emerald-400">GH₵ 0.00 (BALANCED)</strong></div>
                    <div>📈 NET CASH FLOW: <strong className="text-white text-xs">GH₵ 3,430.00</strong></div>
                    <div className="text-[10px] text-slate-500 pt-1 text-right">
                      20:00 GMT · Delivered ✓✓
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-[11px] text-emerald-400 font-medium">
                    ⚡ Automatically sent every evening at closing time
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE & ROI CALCULATOR SECTION */}
      <section id="calculator" className="py-16 bg-[#061016] border-y border-slate-800 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Interactive ROI Calculator
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              See How Much Leakage Wing POS Prevents
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Retail stores without automated end-of-day register reconciliation lose between 3% to 5% of monthly revenue to untracked cash leakage and manual accounting errors.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            {/* Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300">
                  Your Estimated Daily Sales Revenue
                </label>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  GH₵ {dailySalesEstimate.toLocaleString()} / day
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="250"
                value={dailySalesEstimate}
                onChange={(e) => setDailySalesEstimate(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>GH₵ 500 / day</span>
                <span>GH₵ 10,000 / day</span>
                <span>GH₵ 25,000 / day</span>
              </div>
            </div>

            {/* Projection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="bg-[#0b1c24] border border-[#163647] rounded-2xl p-4 text-center">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Projected Monthly Revenue
                </span>
                <span className="text-xl font-black text-white font-mono mt-1 block">
                  GH₵ {monthlyRevenue.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">30 trading days</span>
              </div>

              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 text-center">
                <span className="text-[11px] font-semibold text-emerald-300 block">
                  Prevented Cash Leakage (Est.)
                </span>
                <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">
                  GH₵ {estimatedLeakagePrevented.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-500/80 block mt-0.5">Saved in your pocket</span>
              </div>

              <div className="bg-[#0b1c24] border border-[#163647] rounded-2xl p-4 text-center">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  WhatsApp Daily Reports
                </span>
                <span className="text-xl font-black text-white font-mono mt-1 block">
                  30 Automated
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Hands-free close audits</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => onNavigateToOnboarding('BUSINESS_PRO')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <span>Protect Your Store Revenue · Start Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            Built for Modern Retail
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Everything You Need to Run & Grow Your Shop
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            From cashier checkout to automated marketing broadcasts, Wing POS handles the operations so you can focus on scale.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Automated WhatsApp Close Reports
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No more waiting for cashiers to text numbers manually. As soon as the register is closed or at your scheduled closing time, the server auto-dispatches an itemized revenue summary to your phone.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Paystack MoMo & Card Checkouts
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accept MTN MoMo, Telecel Cash, AT Money, and Visa/Mastercard debit cards. Log customer references, split payment channels, and generate printed or WhatsApp receipts in seconds.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              36 Ghana & World Holidays Promos
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pre-loaded with 36 statutory and commercial holidays (6th March Independence Day, Easter, Eid, Workers' Day, Black Friday, Christmas) with pre-written WhatsApp templates and discount offers.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Multi-Tenant Store Management
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage multiple branch stores or business profiles under one subscription. Easily switch between shops, upload unique store logos, and track separate revenue books effortlessly.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Accounting-Ready CSV Exports
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export sales logs, expense registers, stock inventories, and customer phone lists directly to CSV format ready for Microsoft Excel, Google Sheets, or accountant tax audits.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Anti-Leakage Reconciliation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Daily cashier registers compare expected system revenue against actual counted cash and MoMo settlements to highlight any shortages immediately before shifts end.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 bg-[#061016] border-y border-slate-800 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Simple, Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Invest in Profit Protection & Growth
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg mx-auto">
              Start with a 14-day free trial on any plan. Cancel or upgrade anytime via Paystack.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center bg-slate-900 border border-slate-800 p-1.5 rounded-2xl mt-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => setBillingCycle('MONTHLY')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  billingCycle === 'MONTHLY'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('ANNUAL')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'ANNUAL'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-slate-900 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                  -20% OFF
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p) => {
              const price = billingCycle === 'ANNUAL' ? p.annualPrice : p.monthlyPrice;
              return (
                <div
                  key={p.id}
                  className={`rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                    p.popular
                      ? 'bg-[#0c242f] border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10'
                      : 'bg-slate-900 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                      Most Popular Choice
                    </span>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 min-h-[36px]">
                      {p.description}
                    </p>

                    <div className="mt-4 pb-4 border-b border-slate-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white font-mono">
                          {price}
                        </span>
                        <span className="text-xs text-slate-400">{p.period}</span>
                      </div>
                      {billingCycle === 'ANNUAL' && p.id !== 'FREE_TRIAL' && (
                        <span className="text-[10px] text-emerald-400 font-medium block mt-1">
                          Billed annually (save 20%)
                        </span>
                      )}
                    </div>

                    <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800/80">
                    <button
                      onClick={() => onNavigateToOnboarding(p.id)}
                      className={`w-full py-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        p.popular
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      <span>{p.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 px-4 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Got Questions? We Have Answers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-200 hover:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="py-16 px-4 lg:px-8 bg-gradient-to-b from-[#061016] to-[#08151c] border-t border-slate-800">
        <div className="max-w-4xl mx-auto bg-gradient-to-tr from-emerald-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold mx-auto shadow-lg shadow-emerald-500/30">
            <Building2 className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight max-w-xl mx-auto">
            Ready to Automate Your Retail Store Operations?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Join hundreds of forward-thinking retailers and supermarkets across Ghana and West Africa. Setup takes less than 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToOnboarding('BUSINESS_PRO')}
              className="px-8 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-xl shadow-emerald-400/25 cursor-pointer"
            >
              Start 14-Day Free Trial
            </button>
            <button
              onClick={onNavigateToApp}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-2xl border border-slate-700 transition-all cursor-pointer"
            >
              Explore Live Demo First
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-slate-800 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Wing POS Platform</span>
            <span>·</span>
            <span>Multi-Tenant Retail Management & Paystack MoMo Gateway</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={onOpenVpsGuide}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              VPS Deployment Guide
            </button>
            <span>·</span>
            <button
              onClick={onNavigateToLogin}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Business Login
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigateToOnboarding()}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Onboard Business
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
