import React, { useState, useRef } from 'react';
import { 
  X, 
  Store, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  Upload, 
  Sparkles,
  Phone,
  Check,
  Zap,
  Globe,
  Sliders,
  DollarSign
} from 'lucide-react';
import { BusinessProfile, PaymentProvider, SubscriptionPlan, User } from '../types';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOnboardingComplete: (newBusiness: BusinessProfile, newUser?: User) => void;
  onShowToast: (msg: string) => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onOnboardingComplete,
  onShowToast,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Store details & Logo
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics & Retail');
  const [city, setCity] = useState('Accra');
  const [country, setCountry] = useState('Ghana');
  const [currency, setCurrency] = useState('GH₵');
  const [phone, setPhone] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [logo, setLogo] = useState<string>('');

  // Step 2: Payment Platform
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>('PAYSTACK');
  const [momoEnabled, setMomoEnabled] = useState(true);
  const [cardEnabled, setCardEnabled] = useState(true);
  const [testMode, setTestMode] = useState(false);

  // Step 3: Subscription Mode
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>('BUSINESS_PRO');
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');

  // Step 4: Admin / Owner Credentials
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('password123');
  const [terminalPin, setTerminalPin] = useState('1234');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setLogo(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFinishOnboarding = async () => {
    if (!name.trim()) {
      onShowToast('Please provide a business name.');
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
      onShowToast(`🎉 Welcome to ${data.business.name}! Store onboarded with ${paymentProvider} billing.`);
      onClose();
    } catch (err) {
      console.error(err);
      onShowToast('Failed to onboard business. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
        {/* Top Header */}
        <div className="bg-[#0b1c24] text-white px-6 py-4 flex items-center justify-between border-b border-[#142d3a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Multi-Tenant Platform Onboarding</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Step {step} of 4
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Register a new store tenant with Paystack gateway & automated WhatsApp reporting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 text-[11px] font-bold">
          <div className={`py-2 px-3 text-center border-b-2 flex items-center justify-center gap-1.5 ${
            step === 1 ? 'border-emerald-600 text-emerald-800 bg-white' : step > 1 ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'
          }`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
              step > 1 ? 'bg-emerald-600 text-white' : step === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > 1 ? '✓' : '1'}
            </span>
            <span className="hidden sm:inline">Store Identity</span>
          </div>

          <div className={`py-2 px-3 text-center border-b-2 flex items-center justify-center gap-1.5 ${
            step === 2 ? 'border-emerald-600 text-emerald-800 bg-white' : step > 2 ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'
          }`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
              step > 2 ? 'bg-emerald-600 text-white' : step === 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > 2 ? '✓' : '2'}
            </span>
            <span className="hidden sm:inline">Payment Gateway</span>
          </div>

          <div className={`py-2 px-3 text-center border-b-2 flex items-center justify-center gap-1.5 ${
            step === 3 ? 'border-emerald-600 text-emerald-800 bg-white' : step > 3 ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'
          }`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
              step > 3 ? 'bg-emerald-600 text-white' : step === 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > 3 ? '✓' : '3'}
            </span>
            <span className="hidden sm:inline">Subscription</span>
          </div>

          <div className={`py-2 px-3 text-center border-b-2 flex items-center justify-center gap-1.5 ${
            step === 4 ? 'border-emerald-600 text-emerald-800 bg-white' : 'border-transparent text-slate-400'
          }`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
              step === 4 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
            }`}>
              4
            </span>
            <span className="hidden sm:inline">Owner Login</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4 max-h-[68vh] overflow-y-auto">
          {/* STEP 1: Business Identity & Logo */}
          {step === 1 && (
            <div className="space-y-4 text-xs">
              {/* Logo Upload Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-emerald-500 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden shadow-xs transition-all"
                >
                  {logo ? (
                    <img src={logo} alt="Store logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <Camera className="w-6 h-6 mx-auto mb-1 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      <span className="text-[10px] font-bold block">Upload Logo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    Business Logo & Branding
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Upload your store emblem. Displays on printed customer receipts, top navigation, and WhatsApp close headers.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <span>Browse Image File (PNG, JPG)</span>
                  </button>
                </div>
              </div>

              {/* Store Details */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Store / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Accra Fresh Supermarket, Star Cafe, etc."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Store Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                  >
                    <option value="Electronics & Retail">Electronics & Gadgets</option>
                    <option value="Grocery & Supermarket">Grocery & Supermarket</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Restaurant & Cafe">Restaurant & Cafe</option>
                    <option value="Pharmacy & Health">Pharmacy & Health</option>
                    <option value="Wholesale & Distribution">Wholesale & Distribution</option>
                    <option value="Other">Other Retail Business</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Currency Symbol
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none"
                  >
                    <option value="GH₵">GH₵ (Ghana Cedi)</option>
                    <option value="₦">₦ (Nigerian Naira)</option>
                    <option value="$">$ (USD)</option>
                    <option value="KSh">KSh (Kenyan Shilling)</option>
                    <option value="CFA">CFA (West African Franc)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Accra, Kumasi, Takoradi, etc."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Ghana"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Store Official Phone
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
                  <label className="font-bold text-slate-800 block mb-1">
                    WhatsApp Report Number
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
            </div>
          )}

          {/* STEP 2: Payment Platform (e.g. Paystack) */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Select Integrated Payment Platform
                </h3>
                <p className="text-[11px] text-slate-500">
                  Accept Mobile Money (MTN, Telecel, AT) and Card settlements natively at checkout.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Paystack Card (Highlighted) */}
                <label
                  onClick={() => setPaymentProvider('PAYSTACK')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentProvider === 'PAYSTACK'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>Paystack (Recommended)</span>
                    </span>
                    {paymentProvider === 'PAYSTACK' && (
                      <span className="bg-emerald-600 text-white p-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Most popular in Ghana & West Africa. Direct support for MTN MoMo, Telecel Cash, AT Money, and Cards with instant webhooks.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold">
                    <span>⚡ Automatic Recurring Subscriptions</span>
                  </div>
                </label>

                {/* Flutterwave */}
                <label
                  onClick={() => setPaymentProvider('FLUTTERWAVE')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentProvider === 'FLUTTERWAVE'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">Flutterwave</span>
                    {paymentProvider === 'FLUTTERWAVE' && (
                      <span className="bg-emerald-600 text-white p-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Pan-African payment platform for local currency collections and international card payments.
                  </p>
                  <div className="mt-3 text-[10px] text-slate-400">
                    Multi-currency payout support
                  </div>
                </label>

                {/* Hubtel */}
                <label
                  onClick={() => setPaymentProvider('HUBTEL')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentProvider === 'HUBTEL'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">Hubtel Ghana</span>
                    {paymentProvider === 'HUBTEL' && (
                      <span className="bg-emerald-600 text-white p-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Local Ghanaian merchant aggregator specialized in domestic Mobile Money and retail POS transactions.
                  </p>
                </label>

                {/* Stripe */}
                <label
                  onClick={() => setPaymentProvider('STRIPE')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentProvider === 'STRIPE'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">Stripe International</span>
                    {paymentProvider === 'STRIPE' && (
                      <span className="bg-emerald-600 text-white p-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Ideal for export businesses and global stores receiving payments in USD, EUR, and GBP.
                  </p>
                </label>
              </div>

              {/* Payment Methods Config */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <span className="font-bold text-slate-800 text-xs block">
                  Accepted Payment Channels for this Store:
                </span>
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={momoEnabled}
                      onChange={(e) => setMomoEnabled(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Mobile Money (MTN / Telecel / AT)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={cardEnabled}
                      onChange={(e) => setCardEnabled(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Debit / Credit Cards (Visa & Mastercard)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={testMode}
                      onChange={(e) => setTestMode(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Sandbox Test Mode</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Subscription Mode & Billing Plan */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Choose Store Subscription Plan
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Select your software tier. Managed via {paymentProvider} recurring billing.
                  </p>
                </div>

                {/* Billing Cycle Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('MONTHLY')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      billingCycle === 'MONTHLY'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('ANNUAL')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                      billingCycle === 'ANNUAL'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1 rounded font-extrabold">Save 20%</span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Starter */}
                <div
                  onClick={() => setSubscriptionPlan('STARTER')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    subscriptionPlan === 'STARTER'
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Starter</h4>
                    <p className="text-[11px] text-slate-500">For single stalls & popups</p>
                    <div className="my-3">
                      <span className="text-2xl font-black text-slate-900">GH₵ {billingCycle === 'MONTHLY' ? '99' : '79'}</span>
                      <span className="text-slate-500 text-[11px]"> / month</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                      <li>✓ 1 Active Cashier Terminal</li>
                      <li>✓ Sales & Expense Tracking</li>
                      <li>✓ CSV Table Exports</li>
                      <li>✓ Manual WhatsApp Report</li>
                    </ul>
                  </div>
                </div>

                {/* Business Pro (Featured) */}
                <div
                  onClick={() => setSubscriptionPlan('BUSINESS_PRO')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                    subscriptionPlan === 'BUSINESS_PRO'
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-lg ring-2 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="absolute -top-2.5 right-3 bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                    POPULAR
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Business Pro</h4>
                    <p className="text-[11px] text-slate-500">Established retail stores</p>
                    <div className="my-3">
                      <span className="text-2xl font-black text-slate-900">GH₵ {billingCycle === 'MONTHLY' ? '249' : '199'}</span>
                      <span className="text-slate-500 text-[11px]"> / month</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-700 border-t border-emerald-100 pt-3 font-medium">
                      <li>✓ <strong>Everything in Starter</strong></li>
                      <li>✓ <strong>Automated Daily WhatsApp Close</strong></li>
                      <li>✓ <strong>Customer CRM & WhatsApp Broadcast</strong></li>
                      <li>✓ <strong>36 Ghana & World Holiday Promos</strong></li>
                      <li>✓ Up to 10 Cashier Accounts</li>
                    </ul>
                  </div>
                </div>

                {/* Enterprise */}
                <div
                  onClick={() => setSubscriptionPlan('ENTERPRISE')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    subscriptionPlan === 'ENTERPRISE'
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Enterprise</h4>
                    <p className="text-[11px] text-slate-500">Chains & supermarkets</p>
                    <div className="my-3">
                      <span className="text-2xl font-black text-slate-900">GH₵ {billingCycle === 'MONTHLY' ? '499' : '399'}</span>
                      <span className="text-slate-500 text-[11px]"> / month</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                      <li>✓ Unlimited Staff & Terminals</li>
                      <li>✓ Multi-Branch Inventory Sync</li>
                      <li>✓ Dedicated Webhook Dispatcher</li>
                      <li>✓ 24/7 Priority Support & SLA</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Store Owner Credentials */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Primary Store Owner / Administrator Account
                </h3>
                <p className="text-[11px] text-slate-500">
                  Create the owner profile who will hold master administrative privileges for {name || 'this store'}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Kwame Mensah"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Owner Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="kwame@yourstore.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Fast 4-Digit Shift PIN
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={terminalPin}
                    onChange={(e) => setTerminalPin(e.target.value)}
                    placeholder="1234"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none font-mono font-bold text-center tracking-widest text-sm"
                  />
                </div>
              </div>

              {/* Onboarding Summary Box */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-950 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Onboarding Summary</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>Store: <strong>{name || 'New Store'}</strong></div>
                  <div>Category: <strong>{category}</strong></div>
                  <div>Payment: <strong>{paymentProvider} (MoMo & Card)</strong></div>
                  <div>Plan: <strong>{subscriptionPlan} ({billingCycle.toLowerCase()})</strong></div>
                  <div>Location: <strong>{city}, {country} ({currency})</strong></div>
                  <div>WhatsApp Auto: <strong>Enabled (20:00 GMT)</strong></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/60 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !name.trim()) {
                  onShowToast('Please enter your business name.');
                  return;
                }
                setStep((s) => (s + 1) as any);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishOnboarding}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>{isSubmitting ? 'Onboarding Store...' : 'Complete Onboarding & Enter Store'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
