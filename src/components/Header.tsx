import React, { useState, useRef } from 'react';
import { 
  Store, 
  Share2, 
  Bell, 
  ChevronDown, 
  Edit2, 
  LogOut, 
  UserCheck, 
  Server, 
  Sparkles,
  Phone,
  ShieldCheck,
  Camera,
  PlusCircle,
  CreditCard,
  Building2,
  Check,
  Printer
} from 'lucide-react';
import { User, BusinessProfile } from '../types';

interface HeaderProps {
  business: BusinessProfile;
  allBusinesses?: BusinessProfile[];
  onSwitchBusiness?: (businessId: string) => void;
  onOpenOnboarding?: () => void;
  onNavigateToLanding?: () => void;
  onLogoUpdated?: (newLogo: string) => void;
  currentUser: User | null;
  unreadAlertsCount: number;
  onOpenBusinessSetup: () => void;
  onOpenWhatsAppReport: () => void;
  onOpenPrinter?: () => void;
  onOpenAlerts: () => void;
  onOpenVpsGuide: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchUser: (userId: string) => void;
  allUsers: User[];
}

export const Header: React.FC<HeaderProps> = ({
  business,
  allBusinesses = [],
  onSwitchBusiness,
  onOpenOnboarding,
  onNavigateToLanding,
  onLogoUpdated,
  currentUser,
  unreadAlertsCount,
  onOpenBusinessSetup,
  onOpenWhatsAppReport,
  onOpenAlerts,
  onOpenVpsGuide,
  onOpenAuth,
  onLogout,
  onSwitchUser,
  allUsers,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        try {
          const res = await fetch('/api/business', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logo: base64 }),
          });
          if (res.ok && onLogoUpdated) {
            onLogoUpdated(base64);
          }
        } catch (err) {
          console.error('Failed to upload logo:', err);
        } finally {
          setIsUploadingLogo(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const currentPlan = business.subscription?.plan || 'BUSINESS_PRO';
  const paymentProvider = business.subscription?.paymentProvider || business.paymentGateway?.provider || 'PAYSTACK';

  return (
    <header className="bg-[#0b1c24] text-white border-b border-[#142d3a] px-4 lg:px-8 py-2.5 sticky top-0 z-40 shadow-md">
      <input
        type="file"
        ref={logoInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleLogoFileChange}
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand, Store Logo & Multi-Tenant Switcher */}
        <div className="flex items-center gap-3 md:gap-5 flex-wrap">
          {/* Logo & Platform Name */}
          <button
            onClick={onNavigateToLanding}
            className="flex items-center gap-2 text-left cursor-pointer hover:opacity-90 transition-opacity"
            title="Return to Platform Landing Page & Pricing"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-base">
              <Sparkles className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-300 font-sans hidden sm:inline">
              Wing POS
            </span>
          </button>

          <div className="h-5 w-px bg-slate-700/60 hidden sm:block"></div>

          {/* Prominent Business Name & Logo (User Request: "make business name bigger with option to upload logo") */}
          <div className="relative">
            <div className="flex items-center gap-2.5 bg-[#122b37] border border-[#1b3d4e] hover:border-emerald-500/50 rounded-xl p-1.5 pr-3 transition-all">
              {/* Store Logo with Upload Overlay */}
              <div 
                onClick={() => logoInputRef.current?.click()}
                className="relative group w-9 h-9 rounded-lg overflow-hidden bg-slate-800 border border-emerald-500/30 shrink-0 cursor-pointer shadow-sm"
                title="Click to Upload / Change Store Logo"
              >
                {business.logo ? (
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-emerald-600 to-teal-700 text-white font-bold text-sm">
                    {business.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {/* Business Name (Bigger typography) & Switcher Dropdown */}
              <button
                onClick={() => setShowTenantDropdown(!showTenantDropdown)}
                className="flex items-center gap-2 text-left cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                      {business.name}
                    </span>
                    <span className="bg-[#1b4355] text-teal-300 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      {business.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>{business.city}, {business.country} ({business.currency})</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {currentPlan.replace('_', ' ')} · {paymentProvider}
                    </span>
                  </div>
                </div>

                <ChevronDown className="w-4 h-4 text-slate-400 hover:text-white transition-transform" />
              </button>
            </div>

            {/* Multi-Tenant Business Switcher Dropdown */}
            {showTenantDropdown && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Business / Store
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                    {allBusinesses.length} Stores
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto py-1">
                  {allBusinesses.map((b) => {
                    const isCurrent = b.id === business.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          if (onSwitchBusiness) onSwitchBusiness(b.id);
                          setShowTenantDropdown(false);
                        }}
                        className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                          isCurrent ? 'bg-emerald-50/60 font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
                            {b.logo ? (
                              <img src={b.logo} alt={b.name} className="w-full h-full object-cover" />
                            ) : (
                              b.name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="text-xs text-slate-900 leading-tight">
                              {b.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {b.city} · {b.currency}
                            </div>
                          </div>
                        </div>

                        {isCurrent && (
                          <Check className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      setShowTenantDropdown(false);
                      if (onOpenOnboarding) onOpenOnboarding();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Onboard New Business</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowTenantDropdown(false);
                      onOpenBusinessSetup();
                    }}
                    className="w-full py-1.5 px-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Store Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Landing Page & Pricing Button */}
          {onNavigateToLanding && (
            <button
              onClick={onNavigateToLanding}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#122834] hover:bg-[#1a3848] text-slate-300 hover:text-white text-xs font-semibold border border-[#1b3d4e] transition-all cursor-pointer"
              title="View platform features, pricing & FAQ"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Landing & Pricing</span>
            </button>
          )}

          {/* Onboard Business Button (Direct in Header) */}
          <button
            onClick={onOpenOnboarding}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142e3b] hover:bg-[#1a3b4c] text-teal-300 text-xs font-semibold border border-[#20475b] transition-all cursor-pointer shadow-sm"
            title="Onboard another business with Paystack subscription"
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
            <span>+ Onboard Business</span>
          </button>

          {/* Receipt Printer (BT / Wi-Fi) Quick Action */}
          {onOpenPrinter && (
            <button
              onClick={onOpenPrinter}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142e3b] hover:bg-[#1a3b4c] text-slate-300 hover:text-white text-xs font-semibold border border-[#20475b] transition-all cursor-pointer shadow-sm"
              title="Receipt Printer Settings (Bluetooth / Wi-Fi)"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Printer</span>
            </button>
          )}

          {/* WhatsApp Report Button */}
          <button
            onClick={onOpenWhatsAppReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00a884] hover:bg-[#008f70] text-white text-xs font-semibold shadow-sm shadow-emerald-900/30 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp Report</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#142e3b] transition-colors"
            title="System Alerts & Restock Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* User Profile / Login dropdown */}
          <div className="relative">
            {currentUser ? (
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#142e3b] transition-colors border border-transparent hover:border-[#20475b] cursor-pointer"
              >
                <img
                  src={
                    currentUser.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500/50"
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold leading-tight text-white flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {currentUser.role.replace('_', ' ')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}

            {/* Profile / Switcher Dropdown */}
            {showUserDropdown && currentUser && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <span className="mt-1 inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>

                {/* Quick Staff Switcher for POS terminal demo */}
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Fast Shift / Profile Switch:
                  </p>
                  <div className="space-y-1">
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded-lg text-xs flex items-center justify-between hover:bg-slate-200/60 transition-colors ${
                          u.id === currentUser.id ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate">{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {u.role === 'BUSINESS_OWNER' ? 'Owner' : u.role === 'MANAGER' ? 'Mgr' : 'Cashier'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenVpsGuide();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Server className="w-3.5 h-3.5 text-slate-400" />
                    <span>VPS Deployment & API Guide</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenBusinessSetup();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                    <span>Store Settings & Paystack Gateway</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 cursor-pointer font-medium border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
