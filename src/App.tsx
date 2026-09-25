/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { DashboardOverview } from './components/DashboardOverview';
import { RecordSaleModal } from './components/RecordSaleModal';
import { SalesTab } from './components/SalesTab';
import { ExpensesTab } from './components/ExpensesTab';
import { StockTab } from './components/StockTab';
import { ReconciliationTab } from './components/ReconciliationTab';
import { StaffTab } from './components/StaffTab';
import { AlertsTab } from './components/AlertsTab';
import { CustomersPromoTab } from './components/CustomersPromoTab';
import { WhatsAppModal } from './components/WhatsAppModal';
import { BusinessSetupModal } from './components/BusinessSetupModal';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';
import { AuthModal } from './components/AuthModal';
import { VpsDeployModal } from './components/VpsDeployModal';
import { Toast } from './components/Toast';
import { LandingPage } from './components/LandingPage';
import { OnboardingPage } from './components/OnboardingPage';
import { BusinessLoginPage } from './components/BusinessLoginPage';
import { 
  User, 
  BusinessProfile, 
  DashboardMetrics, 
  StockItem, 
  Expense, 
  StaffMember, 
  AlertNotification,
  SubscriptionPlan
} from './types';

export type AppView = 'landing' | 'app' | 'onboarding' | 'login';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [onboardingPlan, setOnboardingPlan] = useState<SubscriptionPlan>('BUSINESS_PRO');
  const [currentTab, setCurrentTab] = useState<ActiveTab>('overview');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Current date formatted as DD-MM-YYY
    return new Date().toISOString().split('T')[0];
  });

  // User auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('wing_ai_auth_token') || 'demo_owner_token';
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Multi-Tenant Businesses state
  const [business, setBusiness] = useState<BusinessProfile>({
    id: 'biz_techwokx_gh',
    name: 'Techwokx Ghana',
    category: 'Electronics & Retail',
    city: 'Accra',
    country: 'Ghana',
    currency: 'GH₵',
    phone: '+233 24 456 7890',
    whatsAppNumber: '+233244567890',
    taxRate: 0,
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80',
    paymentGateway: {
      provider: 'PAYSTACK',
      publicKey: 'pk_live_techwokx_gh_78291482',
      testMode: false,
      momoEnabled: true,
      cardEnabled: true,
    },
    subscription: {
      plan: 'BUSINESS_PRO',
      status: 'ACTIVE',
      billingCycle: 'MONTHLY',
      amountGhs: 249,
      nextBillingDate: '2026-10-24',
      paymentProvider: 'PAYSTACK',
    },
  });
  const [allBusinesses, setAllBusinesses] = useState<BusinessProfile[]>([]);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Metrics
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    selectedDate,
    todaySales: 0,
    transactionCount: 0,
    todayExpenses: 0,
    estimatedProfit: 0,
    reconciliation: {
      status: 'Balanced',
      variance: 0,
      expectedRevenue: 0,
      countedActual: 0,
    },
    lowStockCount: 0,
    lowStockItems: [],
  });

  // Collections
  const [stock, setStock] = useState<StockItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);

  // Modals state
  const [isRecordSaleOpen, setIsRecordSaleOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isBusinessSetupOpen, setIsBusinessSetupOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVpsGuideOpen, setIsVpsGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load User Profile
  const fetchAuthUser = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        localStorage.removeItem('wing_ai_auth_token');
        setAuthToken(null);
        setCurrentUser(null);
      }
    } catch (err) {
      console.warn('Auth check error:', err);
    }
  }, []);

  // Fetch Dashboard Metrics & Business
  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await fetch(`/api/dashboard?date=${selectedDate}`);
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        if (data.business) setBusiness(data.business);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  }, [selectedDate]);

  // Fetch Stock Items
  const fetchStock = useCallback(async () => {
    try {
      const res = await fetch('/api/stock');
      if (res.ok) {
        const data = await res.json();
        setStock(data);
      }
    } catch (err) {
      console.error('Error fetching stock:', err);
    }
  }, []);

  // Fetch Expenses
  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch('/api/expenses');
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  }, []);

  // Fetch Staff
  const fetchStaff = useCallback(async () => {
    try {
      const res = await fetch('/api/staff');
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
        setAllUsers(
          data.map((s: StaffMember) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            role: s.role,
            phone: s.phone,
            createdAt: '',
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching staff:', err);
    }
  }, []);

  // Fetch Alerts
  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  }, []);

  // Fetch Tenants (Multi-Tenant Businesses)
  const fetchTenants = useCallback(async () => {
    try {
      const res = await fetch('/api/tenants');
      if (res.ok) {
        const data = await res.json();
        if (data.businesses) setAllBusinesses(data.businesses);
        if (data.current) setBusiness(data.current);
      }
    } catch (err) {
      console.error('Error fetching tenants:', err);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    if (authToken) {
      fetchAuthUser(authToken);
    } else {
      fetchAuthUser('demo_owner_token');
    }
    fetchTenants();
    fetchDashboardData();
    fetchStock();
    fetchExpenses();
    fetchStaff();
    fetchAlerts();
  }, [authToken, fetchAuthUser, fetchTenants, fetchDashboardData, fetchStock, fetchExpenses, fetchStaff, fetchAlerts]);

  // Handlers
  const handleLoginSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('wing_ai_auth_token', token);
    setIsAuthOpen(false);
    fetchDashboardData();
    setCurrentView('app');
  };

  const handleSwitchBusiness = async (businessId: string) => {
    try {
      const res = await fetch(`/api/tenants/${businessId}/switch`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setBusiness(data.business);
        setToastMessage(`Switched active store to ${data.business.name}`);
        handleRefreshAll();
        fetchTenants();
      }
    } catch (err) {
      console.error('Failed to switch business:', err);
      setToastMessage('Failed to switch business store.');
    }
  };

  const handleOnboardingComplete = (newBiz: BusinessProfile, newUser?: User) => {
    setBusiness(newBiz);
    setAllBusinesses((prev) => [newBiz, ...prev.filter((b) => b.id !== newBiz.id)]);
    if (newUser) {
      setCurrentUser(newUser);
    }
    handleRefreshAll();
    fetchTenants();
    setCurrentTab('overview');
    setCurrentView('app');
  };

  const handleLogoUpdated = (newLogo: string) => {
    setBusiness((prev) => ({ ...prev, logo: newLogo }));
    setAllBusinesses((prev) =>
      prev.map((b) => (b.id === business.id ? { ...b, logo: newLogo } : b))
    );
    setToastMessage('Store logo updated successfully!');
  };

  const handleLogout = async () => {
    if (authToken) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      }).catch(() => {});
    }
    localStorage.removeItem('wing_ai_auth_token');
    setAuthToken(null);
    setCurrentUser(null);
    setToastMessage('Logged out successfully.');
    setCurrentView('login');
  };

  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        setAuthToken(data.token);
        localStorage.setItem('wing_ai_auth_token', data.token);
        setToastMessage(`Switched terminal user to ${data.user.name} (${data.user.role})`);
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      await fetch(`/api/alerts/${alertId}/resolve`, { method: 'POST' });
      fetchAlerts();
      setToastMessage('Alert marked as resolved.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefreshAll = () => {
    fetchTenants();
    fetchDashboardData();
    fetchStock();
    fetchExpenses();
    fetchStaff();
    fetchAlerts();
  };

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#08151c] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
        <LandingPage
          business={business}
          onNavigateToOnboarding={(plan) => {
            if (plan) setOnboardingPlan(plan);
            setCurrentView('onboarding');
          }}
          onNavigateToLogin={() => setCurrentView('login')}
          onNavigateToApp={() => setCurrentView('app')}
          onOpenVpsGuide={() => setIsVpsGuideOpen(true)}
        />
        <VpsDeployModal
          isOpen={isVpsGuideOpen}
          onClose={() => setIsVpsGuideOpen(false)}
          onShowToast={(msg) => setToastMessage(msg)}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
        <BusinessLoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateToOnboarding={() => setCurrentView('onboarding')}
          onNavigateToLanding={() => setCurrentView('landing')}
          onNavigateToApp={() => setCurrentView('app')}
          business={business}
          allUsers={allUsers}
          onShowToast={(msg) => setToastMessage(msg)}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </div>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
        <OnboardingPage
          initialPlan={onboardingPlan}
          onOnboardingComplete={(newBiz, newUser) => {
            handleOnboardingComplete(newBiz, newUser);
          }}
          onNavigateToLanding={() => setCurrentView('landing')}
          onNavigateToLogin={() => setCurrentView('login')}
          onShowToast={(msg) => setToastMessage(msg)}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        business={business}
        allBusinesses={allBusinesses}
        onSwitchBusiness={handleSwitchBusiness}
        onOpenOnboarding={() => setCurrentView('onboarding')}
        onNavigateToLanding={() => setCurrentView('landing')}
        onLogoUpdated={handleLogoUpdated}
        currentUser={currentUser}
        unreadAlertsCount={alerts.length}
        onOpenBusinessSetup={() => setIsBusinessSetupOpen(true)}
        onOpenWhatsAppReport={() => setIsWhatsAppOpen(true)}
        onOpenAlerts={() => setCurrentTab('alerts')}
        onOpenVpsGuide={() => setIsVpsGuideOpen(true)}
        onOpenAuth={() => setCurrentView('login')}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        allUsers={allUsers}
      />

      {/* Main Tab Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        alertsCount={alerts.length}
      />

      {/* Main View Container */}
      <main className="flex-1 pb-16">
        {currentTab === 'overview' && (
          <DashboardOverview
            business={business}
            metrics={metrics}
            currentUser={currentUser}
            selectedDate={selectedDate}
            onDateChange={(newDate) => setSelectedDate(newDate)}
            onOpenRecordSale={() => setIsRecordSaleOpen(true)}
            onOpenWhatsAppReport={() => setIsWhatsAppOpen(true)}
            onNavigateTab={(tab) => {
              if (tab === 'sales') setIsRecordSaleOpen(true);
              else setCurrentTab(tab);
            }}
            onShowToast={(msg) => setToastMessage(msg)}
          />
        )}

        {currentTab === 'sales' && (
          <SalesTab
            business={business}
            selectedDate={selectedDate}
            onOpenRecordSale={() => setIsRecordSaleOpen(true)}
            onShowToast={(msg) => setToastMessage(msg)}
          />
        )}

        {currentTab === 'expenses' && (
          <ExpensesTab
            expenses={expenses}
            business={business}
            selectedDate={selectedDate}
            onExpenseAdded={handleRefreshAll}
            onShowToast={(msg) => setToastMessage(msg)}
          />
        )}

        {currentTab === 'stock' && (
          <StockTab
            stock={stock}
            business={business}
            onStockUpdated={handleRefreshAll}
            onShowToast={(msg) => setToastMessage(msg)}
          />
        )}

        {currentTab === 'reconciliation' && (
          <ReconciliationTab
            business={business}
            selectedDate={selectedDate}
            currentUser={currentUser}
            onReconciliationSaved={handleRefreshAll}
            onShowToast={(msg) => setToastMessage(msg)}
            onOpenWhatsAppModal={() => setIsWhatsAppOpen(true)}
          />
        )}

        {currentTab === 'customers' && (
          <CustomersPromoTab
            business={business}
            onShowToast={(msg) => setToastMessage(msg)}
          />
        )}

        {currentTab === 'staff' && (
          <StaffTab
            staffList={staffList}
            business={business}
            onStaffUpdated={fetchStaff}
            onShowToast={(msg) => setToastMessage(msg)}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsTab
            alerts={alerts}
            onResolveAlert={handleResolveAlert}
            onNavigateTab={(tab) => {
              if (tab === 'sales') setIsRecordSaleOpen(true);
              else setCurrentTab(tab);
            }}
          />
        )}
      </main>

      {/* Footer info bar */}
      <footer className="border-t border-slate-200 bg-white py-3 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Wing AI Multi-Tenant POS Platform</span>
            <span>·</span>
            <span>{business.name} ({business.city}, {business.country})</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              + Onboard Another Business
            </button>
            <span>·</span>
            <button
              onClick={() => setIsVpsGuideOpen(true)}
              className="text-slate-600 hover:underline font-medium cursor-pointer"
            >
              VPS & Paystack Guide
            </button>
            <span>·</span>
            <span className="font-mono text-[11px] text-slate-400">v3.8 Multi-Tenant Production</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RecordSaleModal
        isOpen={isRecordSaleOpen}
        onClose={() => setIsRecordSaleOpen(false)}
        stock={stock}
        business={business}
        onSaleCompleted={handleRefreshAll}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        selectedDate={selectedDate}
        business={business}
        onBusinessUpdated={(updated) => {
          setBusiness(updated);
          handleRefreshAll();
        }}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      <BusinessSetupModal
        isOpen={isBusinessSetupOpen}
        onClose={() => setIsBusinessSetupOpen(false)}
        business={business}
        onBusinessUpdated={(updated) => {
          setBusiness(updated);
          handleRefreshAll();
        }}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      <OnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onOnboardingComplete={handleOnboardingComplete}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      <VpsDeployModal
        isOpen={isVpsGuideOpen}
        onClose={() => setIsVpsGuideOpen(false)}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
