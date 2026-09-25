import React, { useState, useRef } from 'react';
import { 
  X, 
  Store, 
  Save, 
  Globe, 
  Phone, 
  Upload, 
  Camera, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Zap, 
  Check,
  CheckCircle2
} from 'lucide-react';
import { BusinessProfile, PaymentProvider, SubscriptionPlan } from '../types';

interface BusinessSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  onBusinessUpdated: (updated: BusinessProfile) => void;
  onOpenOnboarding?: () => void;
  onShowToast: (msg: string) => void;
}

export const BusinessSetupModal: React.FC<BusinessSetupModalProps> = ({
  isOpen,
  onClose,
  business,
  onBusinessUpdated,
  onOpenOnboarding,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'payment_subscription' | 'automation'>('profile');

  // Business Profile & Logo
  const [name, setName] = useState(business.name);
  const [category, setCategory] = useState(business.category);
  const [city, setCity] = useState(business.city);
  const [country, setCountry] = useState(business.country);
  const [currency, setCurrency] = useState(business.currency);
  const [phone, setPhone] = useState(business.phone);
  const [whatsAppNumber, setWhatsAppNumber] = useState(business.whatsAppNumber);
  const [logo, setLogo] = useState<string>(business.logo || '');

  // Payment Platform & Gateway Config
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>(
    business.paymentGateway?.provider || business.subscription?.paymentProvider || 'PAYSTACK'
  );
  const [momoEnabled, setMomoEnabled] = useState(business.paymentGateway?.momoEnabled ?? true);
  const [cardEnabled, setCardEnabled] = useState(business.paymentGateway?.cardEnabled ?? true);
  const [testMode, setTestMode] = useState(business.paymentGateway?.testMode ?? false);
  const [publicKey, setPublicKey] = useState(business.paymentGateway?.publicKey || `pk_live_${business.id}`);

  // Subscription Mode
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>(
    business.subscription?.plan || 'BUSINESS_PRO'
  );
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>(
    business.subscription?.billingCycle || 'MONTHLY'
  );

  // WhatsApp Automation Settings
  const [whatsAppAutoEnabled, setWhatsAppAutoEnabled] = useState(
    business.whatsAppAutomation?.enabled ?? true
  );
  const [whatsAppScheduledTime, setWhatsAppScheduledTime] = useState(
    business.whatsAppAutomation?.scheduledTime || '20:00'
  );

  const [isSaving, setIsSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setLogo(base64);
        onShowToast('Store logo loaded! Click "Save Configuration" to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  const planAmounts: Record<SubscriptionPlan, number> = {
    FREE_TRIAL: 0,
    STARTER: 99,
    BUSINESS_PRO: 249,
    ENTERPRISE: 499,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: Partial<BusinessProfile> = {
        name,
        category,
        city,
        country,
        currency,
        phone,
        whatsAppNumber,
        logo,
        paymentGateway: {
          provider: paymentProvider,
          publicKey,
          testMode,
          momoEnabled,
          cardEnabled,
        },
        subscription: {
          plan: subscriptionPlan,
          status: 'ACTIVE',
          billingCycle,
          amountGhs: planAmounts[subscriptionPlan],
          nextBillingDate: business.subscription?.nextBillingDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          paymentProvider,
          reference: business.subscription?.reference || `sub_${paymentProvider.toLowerCase()}_${Date.now()}`,
        },
        whatsAppAutomation: {
          enabled: whatsAppAutoEnabled,
          autoSendOnReconciliation: true,
          autoSendAtScheduledTime: true,
          scheduledTime: whatsAppScheduledTime,
          recipients: [whatsAppNumber.trim() || business.whatsAppNumber],
          gatewayMode: business.whatsAppAutomation?.gatewayMode || 'VPS_GATEWAY_SERVICE',
          lastDispatchedAt: business.whatsAppAutomation?.lastDispatchedAt,
          lastDispatchStatus: business.whatsAppAutomation?.lastDispatchStatus || 'DELIVERED',
        },
      };

      const res = await fetch('/api/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      onBusinessUpdated(data.business);
      onShowToast('Store configuration, logo, and payment settings updated successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      onShowToast('Failed to update business configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <input
        type="file"
        ref={logoInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleLogoUpload}
      />

      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0b1c24] text-white px-6 py-4 flex items-center justify-between border-b border-[#142d3a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Business Setup & Store Configuration</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {business.name}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage store logo, payment gateway (Paystack), subscription mode, and WhatsApp automation
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

        {/* Sub-tab Switcher */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveSubTab('profile')}
            className={`py-3 px-4 text-center border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'profile'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            1. Store Profile & Logo
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('payment_subscription')}
            className={`py-3 px-4 text-center border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'payment_subscription'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            2. Payment Gateway & Plan
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('automation')}
            className={`py-3 px-4 text-center border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'automation'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            3. WhatsApp Reporting
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* TAB 1: STORE PROFILE & LOGO */}
          {activeSubTab === 'profile' && (
            <div className="space-y-4">
              {/* Logo Upload Box (User request: "make business name bigger with option to upload logo") */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <div 
                  onClick={() => logoInputRef.current?.click()}
                  className="relative group w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 border-2 border-dashed border-slate-300 hover:border-emerald-500 cursor-pointer flex items-center justify-center shrink-0 shadow-xs transition-all"
                  title="Click to Upload Store Logo"
                >
                  {logo ? (
                    <img src={logo} alt="Store logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1 group-hover:text-emerald-600" />
                      <span className="text-[10px] text-slate-500 font-bold block">Upload</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <Upload className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-sm font-black text-slate-900">
                      Store Brand Logo
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Header Display
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload your shop logo (PNG, JPG, SVG). It appears in the main header and printed customer receipts.
                  </p>
                  <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold rounded-lg text-xs shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      <span>{logo ? 'Change Logo' : 'Upload Image'}</span>
                    </button>
                    {logo && (
                      <button
                        type="button"
                        onClick={() => setLogo('')}
                        className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Store Name (Bigger typography) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Business / Store Display Name <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Techwokx Ghana"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Industry / Category
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Electronics, Supermarket, Fashion..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Currency Symbol
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    City / Neighborhood
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Accra, Kumasi, Takoradi..."
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Store Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 24 456 7890"
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
                    placeholder="+233244567890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Multi-Tenant Onboarding Prompt */}
              {onOpenOnboarding && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-emerald-950 block text-xs">
                      🏢 Need to manage multiple branch stores or companies?
                    </span>
                    <span className="text-[11px] text-emerald-800">
                      Wing AI is a multi-tenant platform. You can onboard additional store profiles anytime.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenOnboarding();
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shrink-0 cursor-pointer shadow-xs"
                  >
                    + Onboard Store
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PAYMENT GATEWAY & SUBSCRIPTION MODE */}
          {activeSubTab === 'payment_subscription' && (
            <div className="space-y-4">
              {/* Payment Platform Selection (User request: "option for choose payment platform e.g paystack and subscription mode") */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">
                  Payment Processing Platform
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'PAYSTACK' as PaymentProvider, label: 'Paystack', desc: 'MoMo & Cards (Ghana & Nigeria)', popular: true },
                    { id: 'FLUTTERWAVE' as PaymentProvider, label: 'Flutterwave', desc: 'Pan-Africa Payments', popular: false },
                    { id: 'HUBTEL' as PaymentProvider, label: 'Hubtel', desc: 'Ghana Direct Carrier MoMo', popular: false },
                    { id: 'STRIPE' as PaymentProvider, label: 'Stripe', desc: 'Global Cards & Invoicing', popular: false },
                  ].map((p) => {
                    const isSelected = paymentProvider === p.id;
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setPaymentProvider(p.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {p.popular && (
                          <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                            Preferred
                          </span>
                        )}
                        <span className="font-bold text-slate-900 block text-xs">
                          {p.label}
                        </span>
                        <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                          {p.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gateway Channel Settings */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      Accept Mobile Money (MTN, Telecel, AT)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Enable customers to pay directly via Mobile Money prompts
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={momoEnabled}
                    onChange={(e) => setMomoEnabled(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      Accept Visa & Mastercard
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Allow debit/credit card payments at POS checkout
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={cardEnabled}
                    onChange={(e) => setCardEnabled(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      Sandbox / Test Mode
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Simulate transactions without charging real accounts
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={testMode}
                    onChange={(e) => setTestMode(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Subscription Mode Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 block">
                    Subscription Tier & Mode
                  </label>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('MONTHLY')}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                        billingCycle === 'MONTHLY' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('ANNUAL')}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                        billingCycle === 'ANNUAL' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      Annual (-20%)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'FREE_TRIAL' as SubscriptionPlan, name: 'Free Trial', price: 'GH₵ 0', period: '14 days', features: 'Basic POS, 1 register' },
                    { id: 'STARTER' as SubscriptionPlan, name: 'Starter', price: 'GH₵ 99', period: '/month', features: 'Up to 3 staff, WhatsApp reports' },
                    { id: 'BUSINESS_PRO' as SubscriptionPlan, name: 'Business Pro', price: 'GH₵ 249', period: '/month', features: 'Unlimited staff, 36 holidays promo, auto cron' },
                    { id: 'ENTERPRISE' as SubscriptionPlan, name: 'Enterprise', price: 'GH₵ 499', period: '/month', features: 'Multi-branch sync, priority VPS' },
                  ].map((plan) => {
                    const isSelected = subscriptionPlan === plan.id;
                    return (
                      <button
                        type="button"
                        key={plan.id}
                        onClick={() => setSubscriptionPlan(plan.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">
                            {plan.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-sm font-black text-slate-900">
                            {plan.price}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {plan.period}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-1 leading-tight">
                          {plan.features}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WHATSAPP REPORTING */}
          {activeSubTab === 'automation' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      ⚡ Automated WhatsApp Business Close Report
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Automatically transmit end-of-day revenue, cash-flow, and variance to owner
                    </span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={whatsAppAutoEnabled}
                      onChange={(e) => setWhatsAppAutoEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a884]"></div>
                  </label>
                </div>

                {whatsAppAutoEnabled && (
                  <div className="pt-3 border-t border-emerald-200/80 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-semibold">
                        Daily Scheduled Auto-Send Time:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="time"
                          value={whatsAppScheduledTime}
                          onChange={(e) => setWhatsAppScheduledTime(e.target.value)}
                          className="bg-white border border-emerald-300 rounded-lg px-2.5 py-1 text-slate-900 font-mono font-bold text-xs focus:outline-none"
                        />
                        <span className="text-slate-500 font-bold">GMT</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 bg-white/70 rounded-xl p-2.5 border border-emerald-200/50">
                      Dispatch recipient: <strong className="text-slate-800">{whatsAppNumber || phone || 'Store Phone'}</strong>. Automatically triggers upon closing register reconciliation and every evening at {whatsAppScheduledTime}.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-700/20 disabled:opacity-50 text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
