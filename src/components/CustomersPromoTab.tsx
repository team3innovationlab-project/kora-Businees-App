import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Megaphone, 
  Share2, 
  Calendar, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Check, 
  Sparkles, 
  ExternalLink, 
  Send, 
  Tag, 
  History, 
  CheckCircle2, 
  RefreshCw,
  Gift,
  Clock,
  Globe,
  Bell,
  Smartphone,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Customer, RetailHoliday, PromoBroadcast, BusinessProfile } from '../types';
import { RETAIL_HOLIDAYS_36 } from '../data/holidays';
import { exportToCsv } from '../utils/exportCsv';

interface CustomersPromoTabProps {
  business: BusinessProfile;
  onShowToast: (msg: string) => void;
}

export const CustomersPromoTab: React.FC<CustomersPromoTabProps> = ({
  business,
  onShowToast,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [broadcasts, setBroadcasts] = useState<PromoBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [holidayFilter, setHolidayFilter] = useState<'ALL' | 'GHANA' | 'GLOBAL'>('ALL');
  
  // Selected holiday & composer state
  const [selectedHoliday, setSelectedHoliday] = useState<RetailHoliday | null>(null);
  const [broadcastTitle, setBroadcastTitle] = useState('Weekend Special Broadcast');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<'ALL' | 'VIP' | 'RECENT'>('ALL');
  const [isSending, setIsSending] = useState(false);
  const [dispatchReceipt, setDispatchReceipt] = useState<{
    count: number;
    whatsAppLink: string;
    timestamp: string;
  } | null>(null);

  // Upcoming Holiday Promo & Owner WhatsApp Approval State
  const defaultUpcoming = RETAIL_HOLIDAYS_36.find(h => h.id === 'gh_independence_day') || RETAIL_HOLIDAYS_36[0];
  const [upcomingHoliday, setUpcomingHoliday] = useState<RetailHoliday>(defaultUpcoming);
  const [promoDiscountRate, setPromoDiscountRate] = useState<string>('20% OFF');
  const [customPromoPrice, setCustomPromoPrice] = useState<string>('');
  const [promoTone, setPromoTone] = useState<'festive' | 'flash_sale' | 'vip_exclusive' | 'clearance'>('festive');
  const [isGeneratingPromo, setIsGeneratingPromo] = useState(false);
  const [generatedHeadline, setGeneratedHeadline] = useState<string>('Ghana Independence Day Freedom Promo');
  const [urgencyRating, setUrgencyRating] = useState<'MEDIUM' | 'HIGH' | 'VERY HIGH'>('HIGH');
  const [recommendedSendTime, setRecommendedSendTime] = useState<string>('08:30 AM - 10:30 AM GMT');
  const [copyVariations, setCopyVariations] = useState<string[]>([]);
  const [conversionTips, setConversionTips] = useState<string[]>([
    'Mention Mobile Money (MTN MoMo, Telecel Cash) at counter to reduce checkout abandonment.',
    'Send between 8:30 AM and 10:30 AM GMT for highest open rates on WhatsApp.',
  ]);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [autoGenContent, setAutoGenContent] = useState<string>(() => {
    return defaultUpcoming.promoTemplate
      .replace(/{businessName}/g, business.name)
      .replace(/{discount}/g, '20% OFF')
      .replace(/{city}/g, business.city);
  });
  const [ownerPhone, setOwnerPhone] = useState<string>(business.phone || '+233 24 456 7890');
  const [isNotifyingOwner, setIsNotifyingOwner] = useState(false);
  const [ownerNotificationSent, setOwnerNotificationSent] = useState(false);
  const [ownerApprovalStatus, setOwnerApprovalStatus] = useState<'IDLE' | 'AWAITING_APPROVAL' | 'APPROVED'>('IDLE');
  const [ownerWhatsAppReceipt, setOwnerWhatsAppReceipt] = useState<{
    messageId: string;
    whatsAppLink: string;
    notificationText: string;
    timestamp: string;
  } | null>(null);

  // New customer modal state
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustTag, setNewCustTag] = useState('VIP');
  const [newCustNotes, setNewCustNotes] = useState('');
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);

  useEffect(() => {
    fetchData();
  }, [business.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [custRes, broadRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/broadcasts'),
      ]);
      if (custRes.ok) {
        const custData = await custRes.json();
        setCustomers(custData);
      }
      if (broadRes.ok) {
        const broadData = await broadRes.json();
        setBroadcasts(broadData);
      }
    } catch (err) {
      console.error(err);
      onShowToast('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill composer when a holiday is selected
  const handleSelectHoliday = (holiday: RetailHoliday) => {
    setSelectedHoliday(holiday);
    setBroadcastTitle(`${holiday.name} Campaign`);
    
    // Replace placeholders with business context
    const filledTemplate = holiday.promoTemplate
      .replace(/{businessName}/g, business.name)
      .replace(/{discount}/g, holiday.suggestedDiscount)
      .replace(/{city}/g, business.city);

    setBroadcastMessage(filledTemplate);
    onShowToast(`Loaded promo template for ${holiday.name}!`);

    // Scroll smoothly to composer
    const composer = document.getElementById('broadcast-composer');
    if (composer) {
      composer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-generate promo content with custom discount or custom price
  const handleGenerateHighConversionPromo = async (
    holiday: RetailHoliday = upcomingHoliday,
    discount: string = promoDiscountRate,
    customPrice: string = customPromoPrice,
    tone = promoTone
  ) => {
    setIsGeneratingPromo(true);
    try {
      const res = await fetch('/api/promo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holidayId: holiday.id,
          holidayName: holiday.name,
          displayDate: holiday.displayDate,
          discountRate: discount,
          customPrice: customPrice,
          tone: tone,
          featuredItem: 'our retail store catalog',
        }),
      });

      if (!res.ok) throw new Error('Promo generation failed');
      const data = await res.json();
      if (data.primaryMessage) {
        setAutoGenContent(data.primaryMessage);
        setGeneratedHeadline(data.headline || `${holiday.name} Offer`);
        setCopyVariations(data.variations || []);
        setRecommendedSendTime(data.recommendedSendTime || '08:30 AM - 10:30 AM GMT');
        setUrgencyRating(data.urgencyRating || 'HIGH');
        setConversionTips(data.conversionTips || []);
        setIsAiGenerated(Boolean(data.isAiGenerated));
        onShowToast(`High-conversion promo generated for ${holiday.name}!`);
      }
    } catch (err) {
      console.warn('Fallback to local template:', err);
      handleRegenerateUpcomingContent(holiday, discount, customPrice);
    } finally {
      setIsGeneratingPromo(false);
    }
  };

  const handleRegenerateUpcomingContent = (
    holiday: RetailHoliday = upcomingHoliday,
    discount: string = promoDiscountRate,
    customPrice: string = customPromoPrice
  ) => {
    const offerText = customPrice.trim() ? customPrice.trim() : discount;
    const generated = holiday.promoTemplate
      .replace(/{businessName}/g, business.name)
      .replace(/{discount}/g, offerText)
      .replace(/{city}/g, business.city);
    setAutoGenContent(generated);
    onShowToast(`Updated promo copy for ${holiday.name}!`);
  };

  // Switch upcoming holiday selection
  const handleSelectUpcomingHoliday = (h: RetailHoliday) => {
    setUpcomingHoliday(h);
    setOwnerApprovalStatus('IDLE');
    setOwnerNotificationSent(false);
    handleRegenerateUpcomingContent(h, promoDiscountRate, customPromoPrice);
  };

  // Notify business owner on WhatsApp for upcoming holiday promo
  const handleNotifyOwnerOnWhatsApp = async () => {
    setIsNotifyingOwner(true);
    try {
      const res = await fetch('/api/broadcasts/notify-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holidayId: upcomingHoliday.id,
          holidayName: upcomingHoliday.name,
          proposedDiscount: promoDiscountRate,
          customPrice: customPromoPrice,
          autoContent: autoGenContent,
          ownerPhone: ownerPhone,
        }),
      });

      if (!res.ok) throw new Error('Failed to notify owner');
      const data = await res.json();
      setOwnerWhatsAppReceipt(data);
      setOwnerNotificationSent(true);
      setOwnerApprovalStatus('AWAITING_APPROVAL');
      onShowToast(`🔔 Notification dispatched to Business Owner WhatsApp (${ownerPhone})!`);
    } catch (err) {
      console.error(err);
      onShowToast('Error sending WhatsApp notification to owner.');
    } finally {
      setIsNotifyingOwner(false);
    }
  };

  // Owner approves promo via WhatsApp simulation and triggers customer broadcast
  const handleOwnerApproveAndBroadcast = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/broadcasts/approve-and-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holidayId: upcomingHoliday.id,
          holidayName: upcomingHoliday.name,
          approvedOffer: customPromoPrice || promoDiscountRate,
          finalMessage: autoGenContent,
          approvedBy: `Owner WhatsApp (${ownerPhone})`,
        }),
      });

      if (!res.ok) throw new Error('Approval broadcast failed');
      const data = await res.json();
      setOwnerApprovalStatus('APPROVED');
      setBroadcasts((prev) => [data.broadcast, ...prev]);
      onShowToast(`✅ Approved via WhatsApp! Broadcast successfully sent to ${data.recipientsCount} customers.`);
    } catch (err) {
      console.error(err);
      onShowToast('Error completing owner approval broadcast.');
    } finally {
      setIsSending(false);
    }
  };

  // Filtered customer list
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (audienceFilter === 'VIP') return c.tags.includes('VIP') || c.totalSpend > 1000;
    if (audienceFilter === 'RECENT') return c.orderCount > 1;
    return true;
  });

  // Filtered holidays list
  const filteredHolidays = RETAIL_HOLIDAYS_36.filter((h) => {
    if (holidayFilter === 'ALL') return true;
    return h.region === holidayFilter;
  });

  // Export Customers to CSV
  const handleExportCustomersCsv = () => {
    if (filteredCustomers.length === 0) {
      onShowToast('No customer records to export.');
      return;
    }

    const headers = [
      'Customer Name',
      'Phone Number',
      'WhatsApp Number',
      'Email Address',
      'Total Spend (GHS)',
      'Orders Count',
      'Last Purchase Date',
      'Tags',
      'Customer Notes',
      'Registered Date',
    ];

    const rows = filteredCustomers.map((c) => [
      c.name,
      c.phone,
      c.whatsAppNumber,
      c.email || 'N/A',
      c.totalSpend.toFixed(2),
      c.orderCount,
      c.lastPurchaseDate,
      c.tags.join(', '),
      c.notes || '',
      c.createdAt,
    ]);

    const filename = `${business.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_customers_${new Date().toISOString().split('T')[0]}`;
    exportToCsv(filename, headers, rows);
    onShowToast(`Exported ${filteredCustomers.length} customer phone records to CSV!`);
  };

  // Add customer manually
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustPhone.trim()) {
      onShowToast('Customer phone/WhatsApp number is required.');
      return;
    }

    setIsSavingCustomer(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCustName || 'Valued Customer',
          phone: newCustPhone,
          email: newCustEmail,
          tags: [newCustTag, 'Direct Added'],
          notes: newCustNotes,
        }),
      });

      if (!res.ok) throw new Error('Failed to create customer');
      const data = await res.json();
      setCustomers((prev) => [data.customer, ...prev]);
      onShowToast(`Added ${data.customer.name} to WhatsApp directory.`);
      setIsAddCustomerOpen(false);
      setNewCustName('');
      setNewCustPhone('');
      setNewCustEmail('');
      setNewCustNotes('');
    } catch (err) {
      console.error(err);
      onShowToast('Error adding customer.');
    } finally {
      setIsSavingCustomer(false);
    }
  };

  // Dispatch Broadcast to target customers
  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      onShowToast('Please type a promo broadcast message.');
      return;
    }

    setIsSending(true);
    setDispatchReceipt(null);
    try {
      const res = await fetch('/api/broadcasts/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: broadcastTitle,
          message: broadcastMessage,
          customerIds: filteredCustomers.map((c) => c.id),
          holidayId: selectedHoliday?.id,
          channel: 'WHATSAPP',
        }),
      });

      if (!res.ok) throw new Error('Broadcast failed');
      const data = await res.json();

      setDispatchReceipt({
        count: data.recipientsCount,
        whatsAppLink: data.whatsAppLink,
        timestamp: new Date().toLocaleTimeString(),
      });

      setBroadcasts((prev) => [data.broadcast, ...prev]);
      onShowToast(`Broadcast successfully logged & dispatched to ${data.recipientsCount} customers!`);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to dispatch broadcast.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Customer CRM & Growth Hub
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-slate-500 text-xs">{business.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1 flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-emerald-600" />
            <span>Customer Phone Directory & 36 Holiday Promos</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged customer contacts automatically captured at checkout, 36 Ghana & Global retail holidays, and WhatsApp promo broadcasting.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCustomersCsv}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Download full customer telephone list to CSV for accounting and spreadsheets"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export Customers CSV</span>
          </button>

          <button
            onClick={() => setIsAddCustomerOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* UPCOMING HOLIDAY PROMO & BUSINESS OWNER WHATSAPP APPROVAL CARD */}
      <div className="bg-gradient-to-br from-white via-[#f7fbf9] to-[#eef8f4] rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                <Bell className="w-3 h-3" />
                <span>Holiday Promo Auto-Pilot</span>
              </span>
              <span className="text-emerald-700 text-xs font-semibold">
                Owner WhatsApp Approval System
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <span>Notify Business Owner on WhatsApp to Approve Upcoming Holiday Promo</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              KORA tracks all 36 Ghana statutory holidays & world shopping events, automatically writes tailored promotional broadcast copy with your custom discount or promo price, and sends a WhatsApp approval prompt directly to the business owner before broadcasting to logged store customers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
              ownerApprovalStatus === 'APPROVED'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : ownerApprovalStatus === 'AWAITING_APPROVAL'
                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                : 'bg-white text-slate-700 border-slate-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                ownerApprovalStatus === 'APPROVED' ? 'bg-emerald-600' : ownerApprovalStatus === 'AWAITING_APPROVAL' ? 'bg-amber-500' : 'bg-slate-400'
              }`}></span>
              <span>
                {ownerApprovalStatus === 'APPROVED' 
                  ? 'Approved via WhatsApp' 
                  : ownerApprovalStatus === 'AWAITING_APPROVAL'
                  ? 'Awaiting Owner WhatsApp Approval'
                  : 'Ready to Notify Owner'}
              </span>
            </span>
          </div>
        </div>

        {/* 2-Column Workflow: Config on Left, WhatsApp Live Simulation on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (7 cols): Configuration & Auto-Generation */}
          <div className="lg:col-span-7 space-y-4">
            {/* Holiday Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                1. Select Upcoming Holiday / Event (36 Available)
              </label>
              <select
                value={upcomingHoliday.id}
                onChange={(e) => {
                  const found = RETAIL_HOLIDAYS_36.find((h) => h.id === e.target.value);
                  if (found) {
                    handleSelectUpcomingHoliday(found);
                    handleGenerateHighConversionPromo(found, promoDiscountRate, customPromoPrice, promoTone);
                  }
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
              >
                {RETAIL_HOLIDAYS_36.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.region === 'GHANA' ? '🇬🇭' : '🌍'} {h.name} — {h.displayDate} ({h.suggestedDiscount})
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Discount & Promo Price Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Dynamic Discount Rate
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['10% OFF', '15% OFF', '20% OFF', '25% OFF', '30% OFF', '50% OFF'].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => {
                        setPromoDiscountRate(rate);
                        setCustomPromoPrice('');
                        handleGenerateHighConversionPromo(upcomingHoliday, rate, '', promoTone);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        promoDiscountRate === rate && !customPromoPrice
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {rate}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Or Custom Price / Special Deal
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="e.g. GH₵ 99 Deal or Buy 2 Get 1"
                    value={customPromoPrice}
                    onChange={(e) => {
                      setCustomPromoPrice(e.target.value);
                    }}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customPromoPrice.trim()) {
                        handleGenerateHighConversionPromo(upcomingHoliday, promoDiscountRate, customPromoPrice, promoTone);
                      }
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Tone Selector & Generator Trigger */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. Marketing Tone & Generator
                </label>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  {isAiGenerated ? '✨ Gemini AI Powered' : '⚡ High-Conversion Engine'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'festive', label: '🎉 Festive Celebration' },
                  { id: 'flash_sale', label: '⚡ Urgent Flash Sale' },
                  { id: 'vip_exclusive', label: '👑 VIP Appreciation' },
                  { id: 'clearance', label: '🏷️ Clearance Deal' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setPromoTone(t.id as any);
                      handleGenerateHighConversionPromo(upcomingHoliday, promoDiscountRate, customPromoPrice, t.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      promoTone === t.id
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleGenerateHighConversionPromo(upcomingHoliday, promoDiscountRate, customPromoPrice, promoTone)}
                disabled={isGeneratingPromo}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGeneratingPromo ? 'animate-spin' : ''}`} />
                <span>
                  {isGeneratingPromo
                    ? 'Generating High-Conversion Marketing Copy...'
                    : `Generate High-Conversion Message (${customPromoPrice || promoDiscountRate})`}
                </span>
              </button>
            </div>

            {/* Campaign Insights Metadata Banner */}
            <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Campaign:</span>
                <span className="text-emerald-900 font-semibold">{generatedHeadline}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="bg-white border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                  🔥 Urgency: {urgencyRating}
                </span>
                <span className="bg-white border border-emerald-300 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                  🕒 Best Send: {recommendedSendTime}
                </span>
              </div>
            </div>

            {/* Owner Editable WhatsApp Message Preview Area */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span>4. Edit & Preview Message Before Sending</span>
                  <span className="text-[10px] text-slate-400 font-normal lowercase">(business owner preview)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {autoGenContent.length} chars · WhatsApp formatted (*bold*, _italic_)
                </span>
              </div>
              <textarea
                rows={5}
                value={autoGenContent}
                onChange={(e) => setAutoGenContent(e.target.value)}
                placeholder="Write or edit your promotional broadcast copy here..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm font-sans text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs leading-relaxed"
              />
            </div>

            {/* Alternative Copy Variations (1-click to swap) */}
            {copyVariations.length > 0 && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Alternative High-Conversion Copy Variations:
                </span>
                <div className="space-y-1.5">
                  {copyVariations.map((variant, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white rounded-xl border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex-1 text-slate-600 line-clamp-2 text-[11px] font-sans">
                        "{variant}"
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAutoGenContent(variant);
                          onShowToast(`Applied Variant #${idx + 1} to message preview!`);
                        }}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
                      >
                        Use This Variant →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversion Tips */}
            {conversionTips.length > 0 && (
              <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-2xl text-[11px] text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1 text-amber-950">
                  💡 Marketing Tips for Maximum Sales:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-amber-800 font-medium">
                  {conversionTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Owner Phone & Action Buttons */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Business Owner WhatsApp Number (For Approval Notifications)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="+233 24 000 0000"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-500">Owner Mobile</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleNotifyOwnerOnWhatsApp}
                  disabled={isNotifyingOwner}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isNotifyingOwner ? 'Sending Notification...' : 'Send Approval Notification to Owner WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOwnerApproveAndBroadcast}
                  disabled={isSending}
                  className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSending ? 'Broadcasting...' : 'Simulate Owner Approval & Broadcast'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Visual Phone WhatsApp Simulation of Owner Prompt */}
          <div className="lg:col-span-5">
            <div className="w-full max-w-[340px] mx-auto bg-slate-900 p-3 rounded-[32px] shadow-xl ring-1 ring-slate-800">
              <div className="bg-[#eef2f5] rounded-[24px] overflow-hidden text-slate-800 text-xs flex flex-col h-[440px]">
                
                {/* WhatsApp Chat Bar */}
                <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white/80">←</span>
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                      K
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-bold text-xs text-white">
                        <span>KORA Promo Bot</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-300 fill-emerald-300 text-white" />
                      </div>
                      <div className="text-[9px] text-emerald-100/90 leading-none">
                        Owner Approval Channel
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] text-emerald-200 font-mono">Today</span>
                </div>

                {/* WhatsApp Message Area */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#e5ddd5]/30 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:12px_12px]">
                  {/* Notification bubble sent to owner */}
                  <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-[10px] font-extrabold text-emerald-800 flex items-center gap-1">
                        <Bell className="w-3 h-3 text-emerald-600" />
                        <span>UPCOMING HOLIDAY ALERT</span>
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">Just now</span>
                    </div>

                    <div className="text-[11px] text-slate-800 space-y-1">
                      <p className="font-semibold text-slate-900">
                        Hello {business.name}!
                      </p>
                      <p className="text-slate-600 text-[10px]">
                        Upcoming Event: <strong className="text-slate-900">{upcomingHoliday.name}</strong> ({upcomingHoliday.displayDate})
                      </p>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-1.5 text-[10px] font-mono text-emerald-900">
                        Proposed Offer: <strong>{customPromoPrice || promoDiscountRate}</strong>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-sans text-slate-700 leading-snug">
                      "{autoGenContent}"
                    </div>

                    <div className="text-[10px] bg-amber-50 border border-amber-200 rounded-lg p-1.5 text-amber-900">
                      👉 <strong>Reply "YES" to approve</strong> and auto-broadcast to {filteredCustomers.length} registered customer numbers.
                    </div>

                    <div className="text-[8px] text-slate-400 text-right flex items-center justify-end gap-1">
                      <span>Delivered</span>
                      <span className="text-sky-500 font-bold">✓✓</span>
                    </div>
                  </div>

                  {/* Owner Response Simulation Bubble */}
                  {ownerApprovalStatus === 'APPROVED' && (
                    <div className="bg-[#dcf8c6] rounded-xl p-2.5 shadow-xs border border-emerald-200 ml-6 space-y-1 animate-in fade-in">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-900">You (Business Owner)</span>
                        <span className="text-[8px] text-slate-500">Just now</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">
                        YES, APPROVED! Launch promo with {customPromoPrice || promoDiscountRate} 🚀
                      </p>
                      <div className="text-[8px] text-slate-500 text-right">✓✓</div>
                    </div>
                  )}

                  {/* Bot confirmation response */}
                  {ownerApprovalStatus === 'APPROVED' && (
                    <div className="bg-white rounded-xl p-2.5 shadow-xs border border-emerald-300 text-[10px] text-emerald-900 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Campaign Activated!</span>
                      </div>
                      <p>
                        Promo has been queued and dispatched to all {filteredCustomers.length} customer WhatsApp numbers.
                      </p>
                    </div>
                  )}
                </div>

                {/* WhatsApp Chat Footer Actions */}
                <div className="bg-white p-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  {ownerWhatsAppReceipt?.whatsAppLink ? (
                    <a
                      href={ownerWhatsAppReceipt.whatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg text-center flex items-center justify-center gap-1 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Open in WhatsApp App</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNotifyOwnerOnWhatsApp}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold py-1.5 px-3 rounded-lg text-center transition-colors cursor-pointer"
                    >
                      Send WhatsApp Link
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleOwnerApproveAndBroadcast}
                    className="bg-slate-900 hover:bg-emerald-800 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 1: 36 Ghana & World Retail Holidays Library */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600" />
              <span>36 Ghana & World Retail Holidays for Instant Promos</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click any statutory holiday or commercial shopping event to auto-populate your WhatsApp promo broadcast
            </p>
          </div>

          {/* Holiday Region Filters */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setHolidayFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                holidayFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              All (36)
            </button>
            <button
              onClick={() => setHolidayFilter('GHANA')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                holidayFilter === 'GHANA' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              <span>🇬🇭 Ghana Holidays (15)</span>
            </button>
            <button
              onClick={() => setHolidayFilter('GLOBAL')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                holidayFilter === 'GLOBAL' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              <span>🌍 World Commercial (21)</span>
            </button>
          </div>
        </div>

        {/* Holiday Cards Carousel / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto p-1 scrollbar-thin">
          {filteredHolidays.map((holiday) => {
            const isSelected = selectedHoliday?.id === holiday.id;
            return (
              <div
                key={holiday.id}
                onClick={() => handleSelectHoliday(holiday)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between hover:scale-[1.01] ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 text-[10px] mb-1.5">
                    <span className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      holiday.region === 'GHANA' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                    }`}>
                      {holiday.region === 'GHANA' ? '🇬🇭 Ghana' : '🌍 Global'}
                    </span>
                    <span className="font-mono text-slate-500 font-semibold">{holiday.displayDate}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs leading-tight line-clamp-1">
                    {holiday.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {holiday.promoHeadline}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    {holiday.suggestedDiscount}
                  </span>

                  <span className={`text-[10px] font-bold flex items-center gap-1 ${
                    isSelected ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-600'
                  }`}>
                    {isSelected ? '✓ Selected' : '⚡ Use Promo'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Broadcast Composer & WhatsApp Dispatch */}
      <div id="broadcast-composer" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00a884] text-white flex items-center justify-center shadow-sm">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                WhatsApp Promo & Marketing Broadcast Composer
              </h2>
              <p className="text-xs text-slate-500">
                Craft promotional broadcasts and dispatch directly to your captured customer contact list
              </p>
            </div>
          </div>

          {selectedHoliday && (
            <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-xl">
              <span>Theme: {selectedHoliday.name}</span>
              <button
                onClick={() => setSelectedHoliday(null)}
                className="text-emerald-700 hover:text-emerald-950 ml-1"
                title="Clear template"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Dispatch Confirmation Banner */}
        {dispatchReceipt && (
          <div className="bg-emerald-600 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div className="text-xs">
                <strong className="block text-sm font-bold">
                  Broadcast Dispatched to {dispatchReceipt.count} Customers!
                </strong>
                <span className="text-emerald-100">
                  Logged at {dispatchReceipt.timestamp} via WhatsApp Marketing Channel.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={dispatchReceipt.whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-800 font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-emerald-50 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in WhatsApp</span>
              </a>

              <button
                onClick={() => setDispatchReceipt(null)}
                className="text-white/80 hover:text-white text-xs px-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 8 Cols: Composer Inputs */}
          <div className="lg:col-span-8 space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. 6th March Freedom Promo"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Target Customer Audience
                </label>
                <select
                  value={audienceFilter}
                  onChange={(e) => setAudienceFilter(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:outline-none"
                >
                  <option value="ALL">All Customers ({customers.length} contacts)</option>
                  <option value="VIP">VIP Big Spenders ({customers.filter((c) => c.tags.includes('VIP') || c.totalSpend > 1000).length} contacts)</option>
                  <option value="RECENT">Repeat Buyers ({customers.filter((c) => c.orderCount > 1).length} contacts)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">
                  Broadcast Message Body (WhatsApp Formatted)
                </label>
                <span className="text-[11px] text-slate-400">
                  Variables: <code className="text-emerald-700 font-bold">{'{businessName}'}</code>, <code className="text-emerald-700 font-bold">{'{city}'}</code>
                </span>
              </div>
              <textarea
                rows={4}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Type your WhatsApp message or select one of the 36 holidays above to auto-generate..."
                className="w-full bg-[#e7fedb]/30 border border-emerald-200 rounded-2xl p-3.5 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed focus:outline-none focus:border-emerald-500 shadow-inner"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <div className="text-xs text-slate-500">
                Audience: <strong className="text-emerald-700">{filteredCustomers.length} customer numbers</strong> will receive this message.
              </div>

              <button
                type="button"
                onClick={handleSendBroadcast}
                disabled={isSending || filteredCustomers.length === 0}
                className="px-6 py-2.5 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Broadcasting to Directory...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Dispatch WhatsApp Broadcast ({filteredCustomers.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right 4 Cols: Recent Broadcast Logs */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Past Broadcast History</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">{broadcasts.length} sent</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {broadcasts.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No broadcasts dispatched yet.
                </div>
              ) : (
                broadcasts.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px] truncate">{b.title}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                        {b.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate font-mono">
                      {b.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>{b.recipientsCount} recipients</span>
                      <span>{new Date(b.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Customer Directory Table with CSV Export */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Logged Customer Contacts Directory ({filteredCustomers.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Customer phone numbers, purchase history, and direct WhatsApp links
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, phone, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none w-52 sm:w-64"
              />
            </div>

            <button
              onClick={handleExportCustomersCsv}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title="Export Table to CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Phone / WhatsApp</th>
                <th className="py-3 px-4">Total Purchases</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4">Customer Segment</th>
                <th className="py-3 px-4 text-right">Direct Chat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching customer records found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const targetPhone = cust.whatsAppNumber.replace(/[^0-9]/g, '');
                  const directLink = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
                    `Hello ${cust.name}! Special greetings from ${business.name}. How can we serve you today?`
                  )}`;

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{cust.name}</div>
                        {cust.email && <div className="text-[10px] text-slate-400">{cust.email}</div>}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{cust.phone}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {business.currency} {cust.totalSpend.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        {cust.orderCount} orders
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {cust.lastPurchaseDate}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {cust.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                tag === 'VIP'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <a
                          href={directLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00a884] hover:bg-[#008f70] text-white text-[11px] font-bold shadow-xs transition-colors"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Add Customer to Directory</span>
              </h3>
              <button
                onClick={() => setIsAddCustomerOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Full Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Ama Frimpong"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="+233 24 123 4567"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    placeholder="customer@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Initial Tag
                  </label>
                  <select
                    value={newCustTag}
                    onChange={(e) => setNewCustTag(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Regular Customer">Regular Customer</option>
                    <option value="Promo Eligible">Promo Eligible</option>
                    <option value="Wholesale">Wholesale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Customer Notes
                </label>
                <textarea
                  rows={2}
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  placeholder="Preferences, delivery address, branch..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCustomer}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer"
                >
                  {isSavingCustomer ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
