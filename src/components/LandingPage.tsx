import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  Play,
  TrendingUp,
  CreditCard,
  Package,
  RefreshCw,
  Users,
  Bell,
  ShieldCheck,
  Receipt,
  CheckCircle2,
  ExternalLink,
  X,
  Phone,
  Store,
  ChevronRight,
  Server,
  Camera,
  ScanLine,
  Zap,
  Sparkles
} from 'lucide-react';
import { BusinessProfile, SubscriptionPlan } from '../types';
import { ScanReconciliationModal, ScanResult } from './ScanReconciliationModal';

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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'momo' | 'telecel' | 'at' | 'card' | 'cash'>('momo');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCameraScannerModal, setShowCameraScannerModal] = useState(false);
  const [lastScannedResult, setLastScannedResult] = useState<ScanResult | null>(null);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');

  const plans = [
    {
      id: 'FREE_TRIAL' as SubscriptionPlan,
      name: 'Free Trial',
      description: 'Ideal for trying out the POS register and automated WhatsApp daily close reports.',
      price: 'GH₵ 0',
      period: 'for 14 days',
      features: [
        'Single POS register terminal',
        'Daily WhatsApp close reports',
        'Camera MoMo SMS & receipt scanning',
        'Real-time inventory tracking',
        'Sales & expenses ledger',
        'Cash & MoMo reconciliation',
      ],
      cta: 'Start 14-Day Free Trial',
      popular: false,
    },
    {
      id: 'STARTER' as SubscriptionPlan,
      name: 'Starter',
      description: 'Perfect for single kiosks, convenience shops, and retail boutiques.',
      price: billingCycle === 'MONTHLY' ? 'GH₵ 99' : 'GH₵ 79',
      period: '/ month',
      features: [
        'Up to 3 cashier & staff accounts',
        'Automated scheduled WhatsApp daily close reports',
        'Camera MoMo SMS & cash receipt scanner',
        'MTN MoMo, Telecel Cash & AT Money tracking',
        'Stock restock alerts & variance detection',
        'Customer logging & CSV export',
      ],
      cta: 'Choose Starter',
      popular: false,
    },
    {
      id: 'BUSINESS_PRO' as SubscriptionPlan,
      name: 'Business Pro',
      description: 'Our most popular plan for busy retail shops, supermarkets, and electronics stores.',
      price: billingCycle === 'MONTHLY' ? 'GH₵ 249' : 'GH₵ 199',
      period: '/ month',
      features: [
        'Unlimited staff & cashier user accounts',
        'Automated WhatsApp daily close reporting',
        'Camera MoMo SMS & receipt reconciliation scanner',
        '36 Ghana & World holiday promo campaigns',
        'Paystack MoMo & Visa/Mastercard processing',
        'Daily register variance & cash leakage shield',
        'Detailed sales & expense accounting exports',
      ],
      cta: 'Start with Business Pro',
      popular: true,
    },
    {
      id: 'ENTERPRISE' as SubscriptionPlan,
      name: 'Enterprise Multi-Store',
      description: 'Designed for supermarkets, multi-branch retailers, and growing chains.',
      price: billingCycle === 'MONTHLY' ? 'GH₵ 499' : 'GH₵ 399',
      period: '/ month',
      features: [
        'Multi-branch store management',
        'Centralized stock across branches',
        'Self-hosted VPS deployment & PM2 support',
        'Custom webhooks & WhatsApp Cloud API',
        'Priority technical support & SLA',
      ],
      cta: 'Choose Enterprise',
      popular: false,
    },
  ];

  const handleScanCompleted = (result: ScanResult) => {
    setLastScannedResult(result);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd] text-slate-800 font-sans selection:bg-emerald-500 selection:text-white antialiased flex flex-col">
      {/* Top Banner: Quick Access Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded text-[10px] uppercase">
              NEW
            </span>
            <span className="text-slate-300">
              Camera MoMo & Receipt Reconciliation Scanner is now live!
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => onNavigateToOnboarding('BUSINESS_PRO')}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>New Business? Register</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={onNavigateToApp}
              className="text-white hover:text-emerald-300 flex items-center gap-1 font-bold cursor-pointer"
            >
              <Zap className="w-3 h-3 fill-emerald-400 text-emerald-400" />
              <span>Launch POS Demo Direct</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Zone */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-left group cursor-pointer focus:outline-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current" aria-hidden="true">
                  <path d="M4 4h4.5v16H4V4zm6.5 0h4.2l5.3 7.8L14.7 20h-4.3l4.8-7.5L10.5 4z" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                KORA
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-emerald-700 hover:text-emerald-800 border-b-2 border-emerald-600 pb-0.5 transition-colors cursor-pointer"
            >
              Home
            </button>
            <a 
              href="#features" 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Features
            </a>
            <a 
              href="#scanner" 
              className="hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>Camera Scanner</span>
            </a>
            <a 
              href="#holidays" 
              className="hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-emerald-600" />
              <span>36 Holiday Promos</span>
            </a>
            <button 
              onClick={() => setShowPricingModal(true)} 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Pricing
            </button>
            <button 
              onClick={() => setShowAboutModal(true)} 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={() => setShowContactModal(true)} 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Action Zone */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onNavigateToApp}
              className="hidden sm:inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs px-3.5 py-2.5 rounded-full transition-colors cursor-pointer border border-slate-200 shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>Launch POS Demo Direct</span>
            </button>

            <button
              onClick={onNavigateToLogin}
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer px-2 py-1.5"
            >
              Sign in
            </button>

            <button
              onClick={() => onNavigateToOnboarding('BUSINESS_PRO')}
              className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full transition-all shadow-xs hover:shadow cursor-pointer flex items-center gap-1"
            >
              <span>New Business? Register</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-[#f2f9f6]/70 via-[#f9fcfa] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Copy & Value Proposition */}
            <div className="lg:col-span-5 space-y-6">
              {/* Category Kicker & Regional Tag */}
              <div className="space-y-2">
                <span className="block text-[11px] font-extrabold uppercase tracking-widest text-emerald-700">
                  THE MODERN RETAIL OPERATING SYSTEM
                </span>

                <div className="inline-flex items-center gap-2 bg-slate-100/90 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200/80">
                  <span className="text-sm">🇬🇭</span>
                  <span>For West Africa</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-emerald-800">Paystack MoMo & WhatsApp Enabled</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 leading-[1.08] tracking-tight">
                Run your store.<br />
                Know your numbers.<br />
                <span className="text-emerald-600">Close every day with</span><br />
                <span className="text-emerald-600">confidence.</span>
              </h1>

              {/* Paragraph */}
              <p className="text-base text-slate-600 leading-relaxed font-normal max-w-lg">
                KORA brings sales, expenses, stock, staff and reconciliation together in one powerful platform. Get real-time insights, automate routines, and make smarter decisions — all from one place.
              </p>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onNavigateToApp}
                  className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-full transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Launch POS Demo Direct</span>
                </button>

                <button
                  onClick={() => onNavigateToOnboarding('BUSINESS_PRO')}
                  className="bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm sm:text-base px-5 py-3.5 rounded-full border border-slate-300 transition-all flex items-center gap-2 shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  <span>New Business? Register</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                </button>

                <button
                  onClick={() => setShowCameraScannerModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-full transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Try Camera MoMo Scanner</span>
                </button>
              </div>

              {/* Trust Checkmarks */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-600 pt-1">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Paystack & MoMo ready
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Deploy on your own VPS
                </span>
              </div>

              {/* Live Instance Badge */}
              <div className="pt-2">
                <button
                  onClick={onNavigateToApp}
                  className="group inline-flex items-center gap-2.5 bg-slate-900 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all cursor-pointer shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-emerald-300">pos.kora.app</span>
                  <span className="text-slate-400">·</span>
                  <span>Live Store Instance: {business.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column: High-Fidelity Device Mockups (WhatsApp Daily Report + POS Register + Retail Owner) */}
            <div className="lg:col-span-7 relative">
              {/* Background Smiling African Retail Owner */}
              <div className="absolute right-0 top-0 w-72 h-80 sm:w-96 sm:h-96 rounded-3xl overflow-hidden opacity-90 shadow-lg border border-slate-200/60 hidden md:block z-0 pointer-events-none">
                <img 
                  src="/src/assets/images/kora_retail_owner_1790320644577.jpg" 
                  alt="Smiling African retail shop owner in green apron"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              </div>

              {/* Handwritten style callout */}
              <div className="absolute -top-4 right-8 z-20 hidden lg:flex flex-col items-center">
                <div className="text-emerald-700 font-bold text-base sm:text-lg tracking-wide transform -rotate-6 font-sans">
                  Smarter Retail for Africa ⤹
                </div>
              </div>

              {/* Devices Presentation Layer */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-8 sm:pt-4">
                
                {/* 1. Smartphone Mockup: WhatsApp Daily Close Report (Front-left) */}
                <div className="sm:col-span-6 z-20">
                  <div className="w-full max-w-[320px] mx-auto bg-slate-900 p-2.5 rounded-[36px] shadow-2xl ring-1 ring-slate-800">
                    {/* Phone Screen */}
                    <div className="bg-[#eef2f5] rounded-[28px] overflow-hidden text-slate-800 text-[11px] font-sans flex flex-col h-[480px]">
                      {/* WhatsApp Chat Header */}
                      <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white/90">←</span>
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                            K
                          </div>
                          <div>
                            <div className="flex items-center gap-1 font-bold text-xs text-white">
                              <span>KORA</span>
                              <CheckCircle2 className="w-3 h-3 text-emerald-300 fill-emerald-300 text-white" />
                            </div>
                            <div className="text-[9px] text-emerald-100/90 leading-none">
                              Daily Close Report · Techwokx Ghana
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-emerald-200">
                          Today, 8:00 PM
                        </div>
                      </div>

                      {/* WhatsApp Chat Body */}
                      <div className="flex-1 p-2.5 overflow-y-auto space-y-2 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:12px_12px] bg-[#e5ddd5]/30">
                        {/* Report Bubble */}
                        <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/80 space-y-2">
                          {/* Store Banner */}
                          <div className="border-b border-slate-100 pb-1.5 text-center">
                            <span className="text-[10px] font-extrabold text-slate-900 tracking-wider block">
                              TECHWOKX GHANA
                            </span>
                            <span className="text-[9px] font-bold text-emerald-700 tracking-wider block">
                              DAILY CLOSE REPORT 📊
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono">
                              Thu, 24 Sep 2026 · 20:00 GMT
                            </span>
                          </div>

                          {/* Today's Sales Hero Metric */}
                          <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg p-2 text-center">
                            <span className="text-[9px] font-semibold text-slate-600 block">
                              TODAY'S TOTAL SALES
                            </span>
                            <span className="text-base font-extrabold text-emerald-700 font-mono tabular-nums">
                              GH₵ 3,840.00
                            </span>
                          </div>

                          {/* Breakdown Lines */}
                          <div className="space-y-1 text-[10px] text-slate-600 font-mono">
                            <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                              <span className="font-sans text-slate-600">🛍 Transactions</span>
                              <span className="font-bold text-slate-800">24 orders</span>
                            </div>
                            <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                              <span className="font-sans text-slate-600">💵 Cash Collected</span>
                              <span className="font-semibold text-slate-800">GH₵ 1,420.00</span>
                            </div>
                            <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                              <span className="font-sans text-slate-600">📱 Mobile Money</span>
                              <span className="font-semibold text-emerald-800">GH₵ 2,120.00</span>
                            </div>
                            <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                              <span className="font-sans text-slate-600">💳 Card Settlements</span>
                              <span className="font-semibold text-slate-800">GH₵ 300.00</span>
                            </div>
                            <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                              <span className="font-sans text-slate-600">📉 Expenses Recorded</span>
                              <span className="font-semibold text-rose-600">GH₵ 410.00</span>
                            </div>
                            <div className="flex justify-between items-center py-0.5 bg-emerald-100/60 rounded px-1">
                              <span className="font-sans font-bold text-emerald-900">⚖ Register Variance</span>
                              <span className="font-extrabold text-emerald-700">GH₵ 0.00 (BALANCED)</span>
                            </div>
                            <div className="flex justify-between items-center pt-1 font-bold text-slate-900">
                              <span className="font-sans">💰 Net Cash Flow</span>
                              <span className="text-emerald-700">GH₵ 3,430.00</span>
                            </div>
                          </div>

                          {/* WhatsApp Timestamp & Delivery Status */}
                          <div className="text-[8px] text-slate-400 text-right flex items-center justify-end gap-1 pt-1">
                            <span>20:00 GMT · Delivered</span>
                            <span className="text-sky-500 font-bold">✓✓</span>
                          </div>
                        </div>

                        {/* WhatsApp Automation Note */}
                        <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-1.5 text-center text-[9px] text-emerald-900 font-medium">
                          ⚡ Automatically sent every evening at closing time.
                        </div>
                      </div>

                      {/* WhatsApp Bottom Bar */}
                      <div className="bg-white px-3 py-2 border-t border-slate-200 flex items-center justify-between text-slate-400 text-xs">
                        <span className="text-[10px]">Type a message...</span>
                        <div className="flex items-center gap-2">
                          <span>📎</span>
                          <span>🎙</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Tablet POS Terminal Mockup (Behind & offset right) */}
                <div className="sm:col-span-6 -mt-6 sm:mt-0 z-10">
                  <div className="w-full max-w-[370px] mx-auto bg-slate-900 p-3 rounded-[32px] shadow-xl ring-1 ring-slate-800">
                    <div className="bg-white rounded-[22px] overflow-hidden text-xs font-sans h-[420px] flex flex-col">
                      {/* POS Header */}
                      <div className="bg-slate-900 text-white px-3 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-slate-900">
                            K
                          </div>
                          <span className="font-bold text-xs tracking-tight">KORA POS</span>
                        </div>
                        <div className="bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-300 flex items-center gap-1">
                          <span>🔍</span>
                          <span>Search products...</span>
                        </div>
                      </div>

                      {/* POS Main Screen */}
                      <div className="flex-1 flex overflow-hidden">
                        {/* Left Catalog Area */}
                        <div className="flex-1 p-2 space-y-2 border-r border-slate-100 overflow-y-auto">
                          {/* Category chips */}
                          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[9px] font-semibold text-slate-600 no-scrollbar">
                            <span className="bg-slate-900 text-white px-2 py-0.5 rounded">All Items</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded">Electronics</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded">Accessories</span>
                          </div>

                          {/* Product Items */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="flex items-center gap-2">
                                <img 
                                  src="/src/assets/images/earbuds_product_1790320657709.jpg" 
                                  alt="Wireless Earbuds"
                                  className="w-7 h-7 rounded object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <div className="font-bold text-[10px] text-slate-800">Wireless Earbuds</div>
                                  <div className="text-[9px] text-emerald-700 font-mono">GH₵ 420.00</div>
                                </div>
                              </div>
                              <span className="text-[9px] font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                x1
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="flex items-center gap-2">
                                <img 
                                  src="/src/assets/images/fast_charger_box_1790320674616.jpg" 
                                  alt="Fast Charger"
                                  className="w-7 h-7 rounded object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <div className="font-bold text-[10px] text-slate-800">Fast Charger</div>
                                  <div className="text-[9px] text-emerald-700 font-mono">GH₵ 360.00</div>
                                </div>
                              </div>
                              <span className="text-[9px] font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                x2
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-xs">
                                  🔌
                                </div>
                                <div>
                                  <div className="font-bold text-[10px] text-slate-800">Braided Cable</div>
                                  <div className="text-[9px] text-emerald-700 font-mono">GH₵ 75.00</div>
                                </div>
                              </div>
                              <span className="text-[9px] font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                x1
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Order Summary Area */}
                        <div className="w-36 p-2 flex flex-col justify-between bg-slate-50/70">
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold block">Cart Total</span>
                            <span className="text-sm font-extrabold text-slate-900 font-mono">GH₵ 855.00</span>
                            
                            <div className="mt-2 space-y-1">
                              <span className="text-[8px] text-slate-400 uppercase font-bold block">Payment</span>
                              <div className="grid grid-cols-2 gap-1 text-[8px] font-semibold">
                                <span className="bg-yellow-400 text-slate-900 px-1 py-0.5 rounded text-center">MoMo</span>
                                <span className="bg-red-600 text-white px-1 py-0.5 rounded text-center">Telecel</span>
                                <span className="bg-blue-600 text-white px-1 py-0.5 rounded text-center">Visa</span>
                                <span className="bg-emerald-600 text-white px-1 py-0.5 rounded text-center">Cash</span>
                              </div>
                            </div>
                          </div>

                          <button 
                            onClick={onNavigateToApp}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-[10px] transition-colors shadow-2xs cursor-pointer text-center"
                          >
                            Complete Sale
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Six Feature Value Pillars Grid */}
      <section id="features" className="py-14 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* 1. Sales */}
            <div className="p-4 rounded-2xl bg-[#f8faf9] border border-slate-100/90 hover:border-emerald-200 transition-all hover:shadow-xs group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Sales
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Record every sale, track in real time.
              </p>
            </div>

            {/* 2. Expenses */}
            <div className="p-4 rounded-2xl bg-[#faf9fc] border border-slate-100/90 hover:border-purple-200 transition-all hover:shadow-xs group">
              <div className="w-12 h-12 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <CreditCard className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Expenses
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Monitor spending and control costs.
              </p>
            </div>

            {/* 3. Stock */}
            <div className="p-4 rounded-2xl bg-[#fcfaf7] border border-slate-100/90 hover:border-amber-200 transition-all hover:shadow-xs group">
              <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Package className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Stock
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Keep the right stock, at the right time.
              </p>
            </div>

            {/* 4. Reconciliation with Camera MoMo Scanner Highlight */}
            <div 
              onClick={() => setShowCameraScannerModal(true)}
              className="p-4 rounded-2xl bg-[#f7faff] border border-sky-200 hover:border-emerald-300 transition-all hover:shadow-md group cursor-pointer relative ring-1 ring-sky-300/40"
            >
              <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Camera className="w-2.5 h-2.5" />
                <span>Scanner</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-100/70 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <RefreshCw className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-1">
                <span>Reconciliation</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal mb-2">
                Balance transactions with ease.
              </p>
              <span className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-1">
                <span>Try Camera Scanner</span>
                <span>→</span>
              </span>
            </div>

            {/* 5. Staff */}
            <div className="p-4 rounded-2xl bg-[#f9f8fc] border border-slate-100/90 hover:border-indigo-200 transition-all hover:shadow-xs group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100/70 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Staff
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Manage your team and shifts.
              </p>
            </div>

            {/* 6. Alerts */}
            <div className="p-4 rounded-2xl bg-[#fcf8f8] border border-slate-100/90 hover:border-rose-200 transition-all hover:shadow-xs group">
              <div className="w-12 h-12 rounded-xl bg-rose-100/70 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Bell className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Alerts
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Get notified before small issues become big problems.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* NEW: Dedicated Phone Camera MoMo & Receipt Reconciliation Feature Section */}
      <section id="scanner" className="py-16 bg-gradient-to-b from-white to-[#f4faf7] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-emerald-100 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Feature explanation */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                <Camera className="w-3.5 h-3.5" />
                <span>CUSTOMER PAYMENT SCANNER</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Scan payment notification receipt from customer after payment to reconcile payment.
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Eliminate manual typing and unverified cash balances. Point your phone camera at the customer's phone showing their MoMo payment notification SMS or customer receipt slip to automatically extract amounts, transaction IDs, and reconcile daily register accounts without leakage.
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instantly scans MTN Mobile Money, Telecel Cash, and AT Money SMS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Captures physical cash drawer totals from thermal till receipts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Logs transaction reference numbers directly into auditor ledger</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setShowCameraScannerModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Test Camera Scanner Live</span>
                </button>

                <button
                  onClick={onNavigateToApp}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                  <span>Launch POS Demo Direct</span>
                </button>
              </div>
            </div>

            {/* Right Column: Visual scanner demo preview */}
            <div className="lg:col-span-6 relative">
              <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
                {/* Visual scan frame */}
                <div className="border border-emerald-500/40 rounded-2xl p-4 sm:p-5 bg-slate-950/80 relative space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                    <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <ScanLine className="w-3.5 h-3.5 animate-pulse" />
                      CAMERA VIEWFINDER ACTIVE
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono text-[10px]">
                      AUTO-DETECT ON
                    </span>
                  </div>

                  {/* MoMo SMS Screen Mockup being scanned */}
                  <div className="bg-white text-slate-900 p-3.5 rounded-xl shadow-md border-l-4 border-yellow-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-slate-700 tracking-wider">
                        MTN Mobile Money SMS
                      </span>
                      <span className="text-[9px] text-slate-400">19:42 GMT</span>
                    </div>
                    <p className="text-xs font-mono font-medium text-slate-800 leading-snug">
                      Payment received for <strong className="text-emerald-700 bg-emerald-50 px-1 rounded">GHS 420.00</strong> from Kwesi Mensah (0244123456). Ref: 298104812. Available Balance: GHS 2,120.00.
                    </p>
                  </div>

                  {/* Recognition Extracted Card */}
                  <div className="bg-emerald-950/80 border border-emerald-500/60 rounded-xl p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between text-emerald-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>OCR Extracted & Matched</span>
                      </span>
                      <span className="font-mono text-base font-extrabold text-white">
                        GH₵ 420.00
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                      <div>Channel: <strong className="text-yellow-400">MTN MoMo</strong></div>
                      <div>Ref: <strong>298104812</strong></div>
                    </div>
                    <div className="text-[10px] text-emerald-200 bg-emerald-900/60 p-1.5 rounded flex items-center justify-between">
                      <span>Register Variance Impact:</span>
                      <strong className="text-emerald-300">GH₵ 0.00 (Balanced)</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCameraScannerModal(true)}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-center"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Scan payment notification receipt from customer after payment to reconcile payment</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Spotlight: FAST CHECKOUT / Multiple Payment Methods */}
      <section className="py-16 lg:py-24 bg-[#f8faf9]/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="block text-xs font-extrabold uppercase tracking-widest text-emerald-600 mb-2">
                  FAST CHECKOUT
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Multiple payment methods, one system.
                </h2>
              </div>

              <p className="text-base text-slate-600 leading-relaxed font-normal">
                Create a sale in seconds and record exactly how the customer paid.
              </p>

              {/* Payment Method Badges / Toggles */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('momo')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPaymentMethod === 'momo'
                      ? 'bg-[#ffcc00] text-slate-950 shadow-xs ring-2 ring-yellow-500/50'
                      : 'bg-[#ffcc00]/90 text-slate-950 hover:bg-[#ffcc00]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-950"></span>
                  MTN MoMo
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('telecel')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPaymentMethod === 'telecel'
                      ? 'bg-[#e60000] text-white shadow-xs ring-2 ring-red-500/50'
                      : 'bg-[#e60000]/90 text-white hover:bg-[#e60000]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  Telecel Cash
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('at')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPaymentMethod === 'at'
                      ? 'bg-[#00875a] text-white shadow-xs ring-2 ring-emerald-500/50'
                      : 'bg-[#00875a]/90 text-white hover:bg-[#00875a]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  AT Money
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('card')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPaymentMethod === 'card'
                      ? 'bg-[#1434cb] text-white shadow-xs ring-2 ring-blue-500/50'
                      : 'bg-[#1434cb]/90 text-white hover:bg-[#1434cb]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Visa / Mastercard
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('cash')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPaymentMethod === 'cash'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 ring-2 ring-emerald-500/30'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <span>💵</span>
                  Cash
                </button>
              </div>

              {/* Auto-generate Receipts bullet */}
              <div className="pt-2 flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Receipt className="w-3.5 h-3.5" />
                </div>
                <span>Auto-generate receipts for your customers</span>
              </div>
            </div>

            {/* Right Side: Fast Checkout POS Tablet + Phone Receipt & Printed Receipt Paper */}
            <div className="lg:col-span-7 relative">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                
                {/* 1. Large POS Checkout Tablet Terminal */}
                <div className="w-full max-w-md bg-slate-900 p-3 rounded-[32px] shadow-2xl ring-1 ring-slate-800">
                  <div className="bg-white rounded-[22px] overflow-hidden text-xs flex flex-col h-[340px]">
                    {/* Tablet Top Nav */}
                    <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-slate-900">
                          K
                        </div>
                        <span className="font-bold text-xs tracking-tight">KORA</span>
                      </div>
                      <div className="bg-slate-800 px-3 py-1 rounded text-[10px] text-slate-300">
                        Search products...
                      </div>
                    </div>

                    {/* Tablet Main View */}
                    <div className="flex-1 flex overflow-hidden">
                      {/* Left: Product List */}
                      <div className="flex-1 p-3 border-r border-slate-100 overflow-y-auto space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 pb-1 border-b border-slate-100">
                          <span>Items (4)</span>
                          <span className="font-mono text-emerald-700">GH₵ 855.00</span>
                        </div>

                        <div className="space-y-1.5 text-[10px]">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700 font-medium">Wireless Earbuds</span>
                            <span className="text-slate-400 font-mono">x1</span>
                            <span className="font-mono font-semibold text-slate-800">420.00</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700 font-medium">Fast Charger</span>
                            <span className="text-slate-400 font-mono">x2</span>
                            <span className="font-mono font-semibold text-slate-800">360.00</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700 font-medium">Braided Cable</span>
                            <span className="text-slate-400 font-mono">x1</span>
                            <span className="font-mono font-semibold text-slate-800">75.00</span>
                          </div>
                        </div>

                        {/* Selected Payment preview */}
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">
                            Selected Method
                          </span>
                          <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold text-[10px] flex items-center justify-between">
                            <span className="uppercase font-mono">{selectedPaymentMethod}</span>
                            <span className="text-emerald-700 font-bold">READY</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Checkout Button & Total */}
                      <div className="w-36 p-3 flex flex-col justify-between bg-slate-50">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-bold block">Total Due</span>
                          <span className="text-base font-extrabold text-slate-900 font-mono">GH₵ 855.00</span>
                        </div>

                        <button
                          type="button"
                          onClick={onNavigateToApp}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs transition-colors shadow-xs cursor-pointer text-center"
                        >
                          Complete Sale
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Connected Phone & Printed Receipt Preview */}
                <div className="relative w-56 -mt-8 sm:mt-0">
                  {/* Smartphone with Payment Successful screen */}
                  <div className="bg-slate-900 p-2.5 rounded-[32px] shadow-xl ring-1 ring-slate-800">
                    <div className="bg-white rounded-[24px] overflow-hidden text-center p-3 h-[250px] flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 mx-auto">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Payment Successful!
                      </span>
                      <span className="text-sm font-extrabold text-emerald-700 font-mono my-1">
                        GH₵ 855.00
                      </span>
                      <span className="text-[10px] text-slate-500 block mb-2">
                        Thank you for your purchase!
                      </span>
                      <button 
                        onClick={onNavigateToApp}
                        className="text-[9px] font-bold text-emerald-700 border border-emerald-600 px-3 py-1 rounded-full hover:bg-emerald-50 cursor-pointer"
                      >
                        View Receipt
                      </button>
                    </div>
                  </div>

                  {/* Printed Receipt Paper Mockup */}
                  <div className="absolute -bottom-10 right-2 w-40 bg-white p-2.5 rounded-lg shadow-xl border border-slate-200 text-[8px] font-mono text-slate-700 rotate-3 z-20">
                    <div className="text-center pb-1 border-b border-dashed border-slate-300">
                      <span className="font-bold text-slate-900 block text-[9px]">KORA RECEIPT</span>
                      <span className="text-[7px] text-slate-500">Techwokx Ghana</span>
                    </div>
                    <div className="py-1 space-y-0.5">
                      <div className="flex justify-between">
                        <span>Earbuds</span>
                        <span>420.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fast Charger x2</span>
                        <span>360.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cable</span>
                        <span>75.00</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900 pt-0.5 border-t border-slate-200">
                        <span>TOTAL</span>
                        <span>GH₵ 855.00</span>
                      </div>
                    </div>
                    {/* Fake QR code */}
                    <div className="w-8 h-8 mx-auto mt-1 border border-slate-300 bg-slate-100 flex items-center justify-center text-[6px]">
                      QR CODE
                    </div>
                    <div className="text-center text-[6px] text-slate-400 mt-1">
                      Thank you!
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: 36 Ghana & World Retail Holidays Promo Hub + Owner WhatsApp Approval */}
      <section id="holidays" className="py-16 lg:py-24 bg-gradient-to-b from-[#f8faf9]/50 via-white to-[#f0f9f5]/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-bold">
              <Gift className="w-3.5 h-3.5" />
              <span>36 HOLIDAYS & INTERNATIONAL EVENTS PROMO AUTOMATION</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
              Run promos from all holidays and 36 international events in the world to your existing customers via WhatsApp.
            </h2>
            
            <p className="text-base text-slate-600 leading-relaxed font-normal">
              Capture seasonal shopping rushes with zero manual marketing hassle. KORA proactively notifies the business owner on WhatsApp before upcoming holidays with auto-generated festive copy, customizable discounts or promo pricing, and 1-tap approval directly via WhatsApp.
            </p>
          </div>

          {/* Interactive Holiday Marketing Experience Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Holiday Library & Pricing Controls */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Popular Holidays & Events Included
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-center gap-2">
                      <span>🇬🇭</span>
                      <span>Ghana Independence Day</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 flex items-center gap-2">
                      <span>🐣</span>
                      <span>Easter & Family Picnic</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200/80 text-purple-900 flex items-center gap-2">
                      <span>🌙</span>
                      <span>Eid al-Fitr & Sallah</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200/80 text-rose-900 flex items-center gap-2">
                      <span>🛍️</span>
                      <span>Black Friday Mega Sale</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-900 flex items-center gap-2">
                      <span>🎄</span>
                      <span>Christmas & Boxing Day</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-sky-50/80 border border-sky-200/80 text-sky-900 flex items-center gap-2">
                      <span>👩</span>
                      <span>Mother's & Women's Day</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-2">
                    + 30 more statutory holidays, Farmers' Day, Cyber Monday, Earth Day, Father's Day & Valentine's.
                  </span>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    How Owner WhatsApp Approval Works:
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <strong className="text-slate-900">3-Day Proactive WhatsApp Reminder:</strong> KORA detects the upcoming holiday and sends a WhatsApp prompt directly to the owner's phone.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <strong className="text-slate-900">Auto-Generated Festive Content:</strong> High-converting copy with store branding, store city, emojis, and urgency is created automatically.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <strong className="text-slate-900">Custom Discount or Price:</strong> Choose 10%–30% OFF or set custom promotional pricing (e.g. <em>GH₵ 99 Deal</em>).
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        4
                      </div>
                      <div>
                        <strong className="text-slate-900">1-Tap WhatsApp Approval:</strong> Business owner replies "YES" on WhatsApp to instantly trigger broadcast to all existing customer contacts!
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={onNavigateToApp}
                    className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Launch POS Demo Direct</span>
                  </button>

                  <button
                    onClick={() => onNavigateToOnboarding('BUSINESS_PRO')}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-all cursor-pointer"
                  >
                    <span>New Business? Register</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Visual WhatsApp Mobile Simulation of Notification & Approval */}
              <div className="lg:col-span-5">
                <div className="w-full max-w-[340px] mx-auto bg-slate-900 p-3 rounded-[32px] shadow-2xl ring-1 ring-slate-800">
                  <div className="bg-[#eef2f5] rounded-[24px] overflow-hidden text-slate-800 text-xs flex flex-col h-[450px]">
                    
                    {/* WhatsApp Header */}
                    <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white/80">←</span>
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                          K
                        </div>
                        <div>
                          <div className="flex items-center gap-1 font-bold text-xs text-white">
                            <span>KORA Holiday Bot</span>
                            <CheckCircle2 className="w-3 h-3 text-emerald-300 fill-emerald-300 text-white" />
                          </div>
                          <div className="text-[9px] text-emerald-100/90 leading-none">
                            Upcoming Promo Automation
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] text-emerald-200 font-mono">Today, 9:00 AM</span>
                    </div>

                    {/* WhatsApp Message Body */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#e5ddd5]/30 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:12px_12px]">
                      
                      {/* Alert Bubble sent to Owner */}
                      <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                          <span className="text-[10px] font-extrabold text-emerald-800 flex items-center gap-1">
                            <Bell className="w-3 h-3 text-emerald-600" />
                            <span>UPCOMING PROMO ALERT</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">09:00 GMT</span>
                        </div>

                        <div className="text-[11px] text-slate-800 space-y-1">
                          <p className="font-semibold text-slate-900">
                            Hello Techwokx Ghana Owner!
                          </p>
                          <p className="text-slate-600 text-[10px]">
                            Upcoming: <strong>Ghana Independence Day (March 6)</strong>
                          </p>
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-1.5 text-[10px] font-mono text-emerald-900">
                            Offer: <strong>25% OFF All Catalog</strong>
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-sans text-slate-700 leading-snug">
                          "🇬🇭⭐ Yεn Ara Asaase Ni! Happy 6th March from Techwokx Ghana! Enjoy our giant Freedom Promo of 25% OFF across our store in Accra today only. Message us here to claim your deals! 🎁"
                        </div>

                        <div className="text-[10px] bg-amber-50 border border-amber-200 rounded-lg p-1.5 text-amber-900">
                          👉 <strong>Reply "YES" to approve</strong> and auto-broadcast to all 154 registered customer numbers.
                        </div>

                        <div className="text-[8px] text-slate-400 text-right flex items-center justify-end gap-1">
                          <span>Delivered</span>
                          <span className="text-sky-500 font-bold">✓✓</span>
                        </div>
                      </div>

                      {/* Owner Approves via WhatsApp */}
                      <div className="bg-[#dcf8c6] rounded-xl p-2.5 shadow-xs border border-emerald-200 ml-6 space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-slate-900">Business Owner</span>
                          <span className="text-[8px] text-slate-500">09:04 GMT</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900">
                          YES, APPROVED! Broadcast 25% Independence Promo 🚀
                        </p>
                        <div className="text-[8px] text-slate-500 text-right">✓✓</div>
                      </div>

                      {/* Bot Confirmation */}
                      <div className="bg-white rounded-xl p-2.5 shadow-xs border border-emerald-300 text-[10px] text-emerald-900 space-y-1">
                        <div className="font-bold flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Broadcast Successfully Sent!</span>
                        </div>
                        <p className="text-slate-600">
                          Dispatched via WhatsApp to all 154 logged customer phones with personalized names.
                        </p>
                      </div>

                    </div>

                    {/* Chat Footer */}
                    <div className="bg-white p-2.5 border-t border-slate-200 text-center">
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                        ⚡ WhatsApp Auto-Pilot Active
                      </span>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Bottom Revenue Protection Banner */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#033b31] via-[#054337] to-[#04604b] rounded-[32px] p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Shield icon and copy */}
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-emerald-300 shrink-0 border border-white/20">
                <ShieldCheck className="w-8 h-8 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Protect your revenue.
                </h3>
                <p className="text-sm sm:text-base text-emerald-100/90 font-normal">
                  Reduce cash leakage. Reconcile with confidence using live phone camera scanning.
                </p>
              </div>
            </div>

            {/* Right: CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={onNavigateToApp}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base px-6 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Launch POS Demo Direct</span>
              </button>

              <button
                onClick={() => onNavigateToOnboarding('BUSINESS_PRO')}
                className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm sm:text-base px-6 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>New Business? Register</span>
                <ArrowRight className="w-4 h-4 text-emerald-700" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Clean Footer matching the design */}
      <footer className="border-t border-slate-100 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white fill-current" aria-hidden="true">
                <path d="M4 4h4.5v16H4V4zm6.5 0h4.2l5.3 7.8L14.7 20h-4.3l4.8-7.5L10.5 4z" />
              </svg>
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              KORA
            </span>
          </div>

          {/* Center: Tagline */}
          <div className="text-sm font-medium text-slate-600">
            Modern retail. Simple.
          </div>

          {/* Right: Actions & Instance */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onNavigateToApp} 
              className="font-mono text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              pos.kora.app
            </button>
            <span>·</span>
            <button 
              onClick={() => onNavigateToOnboarding('BUSINESS_PRO')}
              className="text-slate-600 hover:text-emerald-700 font-semibold cursor-pointer"
            >
              New Business? Register
            </button>
          </div>
        </div>
      </footer>

      {/* Camera MoMo & Receipt Scanner Modal (usable directly from Landing Page!) */}
      <ScanReconciliationModal
        isOpen={showCameraScannerModal}
        onClose={() => setShowCameraScannerModal(false)}
        onScanExtracted={handleScanCompleted}
        currency={business.currency}
      />

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Simple, Transparent Pricing</h3>
                <p className="text-sm text-slate-500">Choose the plan that fits your retail shop.</p>
              </div>
              <button 
                onClick={() => setShowPricingModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-slate-100 p-1 rounded-full flex items-center text-xs font-bold">
                <button
                  onClick={() => setBillingCycle('MONTHLY')}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    billingCycle === 'MONTHLY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('ANNUAL')}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    billingCycle === 'ANNUAL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Annual (20% Off)
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((p) => (
                <div 
                  key={p.id} 
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    p.popular 
                      ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20' 
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div>
                    {p.popular && (
                      <span className="text-[10px] font-extrabold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full inline-block mb-2">
                        Most Popular
                      </span>
                    )}
                    <h4 className="text-base font-bold text-slate-900">{p.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 mb-3">{p.description}</p>
                    <div className="mb-4">
                      <span className="text-2xl font-black text-slate-900 font-mono">{p.price}</span>
                      <span className="text-xs text-slate-500 ml-1">{p.period}</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mb-6">
                      {p.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowPricingModal(false);
                      onNavigateToOnboarding(p.id);
                    }}
                    className={`w-full py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      p.popular
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-xl font-bold text-slate-900">About KORA</h3>
              <button 
                onClick={() => setShowAboutModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              KORA is the modern retail operating system built specifically for retail storefronts, supermarkets, boutiques, and pharmacies across West Africa.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Our mission is to eliminate cash shrinkage and guesswork in retail through seamless POS checkout, integrated Mobile Money reconciliation, phone camera scanning for MoMo SMS alerts, and automated daily WhatsApp financial close reports delivered directly to the business owner every evening.
            </p>
            <button
              onClick={() => {
                setShowAboutModal(false);
                onNavigateToOnboarding('BUSINESS_PRO');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-full text-sm transition-colors cursor-pointer"
            >
              Start Free Trial with KORA
            </button>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-xl font-bold text-slate-900">Contact KORA Support</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 text-sm text-slate-600 mb-6">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Store className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-bold text-slate-900">Store Support Hub</div>
                  <div className="text-xs text-slate-500">Accra, Ghana</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Phone className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-bold text-slate-900">WhatsApp & Phone Hotline</div>
                  <div className="text-xs text-slate-500">{business.phone || '+233 24 456 7890'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Server className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-bold text-slate-900">Self-Hosted VPS Inquiries</div>
                  <div className="text-xs text-slate-500">support@kora.app</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowContactModal(false);
                onOpenVpsGuide();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-full text-xs transition-colors cursor-pointer mb-2"
            >
              Open VPS & Self-Host Guide
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
