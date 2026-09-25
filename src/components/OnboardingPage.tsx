import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Store, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  Upload, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  DollarSign,
  Globe,
  Sliders,
  Zap,
  Lock,
  User as UserIcon,
  HelpCircle
} from 'lucide-react';
import { BusinessProfile, PaymentProvider, SubscriptionPlan, User } from '../types';

interface OnboardingPageProps {
  initialPlan?: SubscriptionPlan;
  onOnboardingComplete: (newBusiness: BusinessProfile, newUser?: User) => void;
  onNavigateToLanding: () => void;
  onNavigateToLogin: () => void;
  onShowToast: (msg: string) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  initialPlan = 'BUSINESS_PRO',
  onOnboardingComplete,
  onNavigateToLanding,
  onNavigateToLogin,
  onShowToast,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Store Details & Logo
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics & Retail');
  const [city, setCity] = useState('Accra');
  const [country, setCountry] = useState('Ghana');
  const [currency, setCurrency] = useState('GH₵');
  const [phone, setPhone] = useState('+233 24 ');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [logo, setLogo] = useState<string>('');

  // Step 2: Payment Platform & Gateway
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>('PAYSTACK');
  const [momoEnabled, setMomoEnabled] = useState(true);
  const [cardEnabled, setCardEnabled] = useState(true);
  const [testMode, setTestMode] = useState(false);

  // Step 3: Subscription Mode
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');

  // Step 4: Admin / Owner Credentials & POS PIN
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('admin123');
  const [terminalPin, setTerminalPin] = useState('1234');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setLogo(base64);
        onShowToast('Store brand logo uploaded!');
      }
    };
    reader.readAsDataURL(file);
  };

  const planAmounts: Record<SubscriptionPlan, { monthly: number; annual: number }> = {
    FREE_TRIAL: { monthly: 0, annual: 0 },
    STARTER: { monthly: 99, annual: 79 },
    BUSINESS_PRO: { monthly: 249, annual: 199 },
    ENTERPRISE: { monthly: 499, annual: 399 },
  };

  const handleFinishOnboarding = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      onShowToast('Please specify a business name.');
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        category,
        city,
        country,
        currency,
        phone: phone || '+233 24 000 0000',
        whatsAppNumber: whatsAppNumber || phone || '+233240000000',
        logo: logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=160&q=80',
        paymentProvider,
        subscriptionPlan,
        billingCycle,
        ownerName: ownerName || 'Store Owner',
        ownerEmail: ownerEmail || `owner_${Date.now().toString(36)}@example.com`,
      };

      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Onboarding request failed');
      const data = await res.json();

      onOnboardingComplete(data.business, data.user);
      onShowToast(`🎉 Successfully onboarded ${data.business.name}! Your POS register and WhatsApp reports are ready.`);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to onboard business. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleLogoUpload}
      />

      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onNavigateToLanding}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Platform Overview</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-xs">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">
              Wing POS Onboarding
            </span>
          </div>

          <button
            onClick={onNavigateToLogin}
            className="text-xs text-slate-600 hover:text-emerald-700 font-semibold cursor-pointer"
          >
            Already have an account? <strong className="text-emerald-700">Log In</strong>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* Step Progression */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              Multi-Tenant Store Setup
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Onboard Your Retail Business
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
              Get instant access to automated WhatsApp close reports, fast POS registers, and Paystack Mobile Money payments.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-4 bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs text-xs font-bold">
            {[
              { num: 1, label: 'Store Identity' },
              { num: 2, label: 'Payment Platform' },
              { num: 3, label: 'Subscription' },
              { num: 4, label: 'Credentials' },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num as any)}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  step === s.num
                    ? 'bg-slate-900 text-white shadow-xs'
                    : step > s.num
                    ? 'text-emerald-700 bg-emerald-50/70'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.num
                    ? 'bg-emerald-400 text-slate-950'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Container Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8">
          {/* STEP 1: STORE IDENTITY & LOGO */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">
                  Step 1: Store Branding & Information
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your store's commercial identity and upload your store logo
                </p>
              </div>

              {/* Logo Upload Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 border-2 border-dashed border-slate-300 hover:border-emerald-500 cursor-pointer flex items-center justify-center shrink-0 shadow-xs transition-all"
                  title="Click to Upload Store Logo"
                >
                  {logo ? (
                    <img src={logo} alt="Store logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1 group-hover:text-emerald-600" />
                      <span className="text-[10px] text-slate-500 font-bold block">Upload Logo</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <Upload className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-sm font-bold text-slate-900">Store Logo & Brand Icon</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Header Display
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload your store logo to make your store branding larger and prominent in customer receipts and top bar.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold rounded-xl text-xs shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    <span>{logo ? 'Change Image' : 'Choose Logo File'}</span>
                  </button>
                </div>
              </div>

              {/* Store Name Input */}
              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs">
                  Store / Business Name <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Accra Fresh Supermarket or Spintex Gadget Hub"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Industry / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="Electronics & Retail">Electronics & Tech Gadgets</option>
                    <option value="Grocery & Supermarket">Grocery & Supermarket</option>
                    <option value="Fashion & Boutique">Fashion, Clothing & Boutique</option>
                    <option value="Pharmacy & Health">Pharmacy & Drug Store</option>
                    <option value="Restaurant & Cafe">Restaurant, Bar & Cafe</option>
                    <option value="General Retail">General Merchandise / Provisions</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Store Currency Symbol
                  </label>
                  <input
                    type="text"
                    required
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder="GH₵, $, ₦, etc."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    City / Neighborhood
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Accra, Kumasi, Takoradi, Tema..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Store Contact Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 24 123 4567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    WhatsApp Close Report Number
                  </label>
                  <input
                    type="text"
                    value={whatsAppNumber}
                    onChange={(e) => setWhatsAppNumber(e.target.value)}
                    placeholder="+233241234567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!name.trim()) {
                      onShowToast('Please enter your store name to proceed.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Payment Gateway</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT GATEWAY PLATFORM */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">
                  Step 2: Choose Payment Platform (e.g. Paystack)
                </h2>
                <p className="text-xs text-slate-500">
                  Select your gateway provider to process Mobile Money and card payments at checkout
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    id: 'PAYSTACK' as PaymentProvider,
                    name: 'Paystack',
                    desc: 'Ghana MTN, Telecel, AT Mobile Money & Cards. Direct bank settlements.',
                    recommended: true,
                  },
                  {
                    id: 'FLUTTERWAVE' as PaymentProvider,
                    name: 'Flutterwave',
                    desc: 'Multi-currency gateway for Pan-African cross-border payments.',
                    recommended: false,
                  },
                  {
                    id: 'HUBTEL' as PaymentProvider,
                    name: 'Hubtel',
                    desc: 'Ghana local carrier billing and merchant MoMo aggregator.',
                    recommended: false,
                  },
                  {
                    id: 'STRIPE' as PaymentProvider,
                    name: 'Stripe',
                    desc: 'Global credit & debit cards, Apple Pay & international invoicing.',
                    recommended: false,
                  },
                ].map((g) => {
                  const isSelected = paymentProvider === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setPaymentProvider(g.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {g.recommended && (
                        <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                          Recommended in Ghana
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <CreditCard className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span className="font-bold text-sm text-slate-900">{g.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {g.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Channels */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Enable Mobile Money (MTN, Telecel, AT)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Allows sales cashiers to accept MoMo prompts directly
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={momoEnabled}
                    onChange={(e) => setMomoEnabled(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Enable Visa & Mastercard Card Settlements
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Process chip, contactless, or POS terminal card payments
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={cardEnabled}
                    onChange={(e) => setCardEnabled(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Sandbox Test Mode
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Safely simulate customer transactions before going live
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={testMode}
                    onChange={(e) => setTestMode(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer"
                >
                  ← Back to Store Identity
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Subscription Mode</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUBSCRIPTION MODE */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Step 3: Choose Your Subscription Mode
                  </h2>
                  <p className="text-xs text-slate-500">
                    All plans include a 14-day free trial. Cancel or change tier anytime.
                  </p>
                </div>

                {/* Billing cycle toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('MONTHLY')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      billingCycle === 'MONTHLY' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('ANNUAL')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      billingCycle === 'ANNUAL' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Annual (-20%)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    id: 'FREE_TRIAL' as SubscriptionPlan,
                    name: '14-Day Free Trial',
                    price: 'GH₵ 0',
                    features: ['Single POS counter register', 'Daily manual WhatsApp reports', 'CSV accounting exports', 'Free community support'],
                  },
                  {
                    id: 'STARTER' as SubscriptionPlan,
                    name: 'Starter Plan',
                    price: billingCycle === 'ANNUAL' ? 'GH₵ 79' : 'GH₵ 99',
                    features: ['Up to 3 sales cashiers', 'Daily WhatsApp close reports', '36 holidays marketing templates', 'Stock restock alerts'],
                  },
                  {
                    id: 'BUSINESS_PRO' as SubscriptionPlan,
                    name: 'Business Pro',
                    price: billingCycle === 'ANNUAL' ? 'GH₵ 199' : 'GH₵ 249',
                    popular: true,
                    features: ['Unlimited staff & cashier accounts', 'Automated scheduled WhatsApp cron', '36 Ghana & World promo broadcasts', 'Customer CRM & phone logger', 'Paystack MoMo integration'],
                  },
                  {
                    id: 'ENTERPRISE' as SubscriptionPlan,
                    name: 'Enterprise Multi-Store',
                    price: billingCycle === 'ANNUAL' ? 'GH₵ 399' : 'GH₵ 499',
                    features: ['Multi-tenant branch management', 'Priority VPS deployment support', 'Custom webhooks & API access', 'Dedicated account manager'],
                  },
                ].map((plan) => {
                  const isSelected = subscriptionPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSubscriptionPlan(plan.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                          Most Popular
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{plan.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>

                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-900">{plan.price}</span>
                        <span className="text-[11px] text-slate-500">/ month</span>
                      </div>

                      <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer"
                >
                  ← Back to Payment Platform
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Owner Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ADMIN CREDENTIALS & POS PIN */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">
                  Step 4: Owner Admin Account & Counter PIN
                </h2>
                <p className="text-xs text-slate-500">
                  Create your administrator credentials and the 4-digit PIN used by cashiers to sign in to the POS terminal
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Store Owner Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. George Jabley"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Administrator Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="owner@yourstore.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Account Password
                    </label>
                    <input
                      type="password"
                      required
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Counter Terminal PIN (4-Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={terminalPin}
                      onChange={(e) => setTerminalPin(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="1234"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold text-center tracking-widest text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Onboarding Summary Box */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-xs text-slate-700 space-y-2">
                <span className="font-bold text-slate-900 block">
                  ✨ Ready to Complete Setup:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>Store: <strong className="text-slate-900">{name || 'New Store'}</strong></div>
                  <div>Location: <strong className="text-slate-900">{city}, {country}</strong></div>
                  <div>Payment Gateway: <strong className="text-slate-900">{paymentProvider}</strong></div>
                  <div>Subscription: <strong className="text-slate-900">{subscriptionPlan.replace('_', ' ')}</strong> ({billingCycle})</div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer"
                >
                  ← Back to Subscription
                </button>
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Launching Store...' : 'Complete Setup & Launch POS'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        <span>Wing POS Platform · Multi-Tenant Retail Management & Paystack MoMo Gateway</span>
      </footer>
    </div>
  );
};
